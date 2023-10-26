import express from 'express'
import { generateUniqueNodePort, generateUniqueName } from './utils/instanceUtils.js';
import { exec } from 'child_process'
import * as fs from 'fs';

const app = express();
const port = 3001;

exec("terraform init", { cwd: './iac' })

app.post('/createInstance', (req, res) => {
    const instanceName = generateUniqueName(); 
    const nodePort = generateUniqueNodePort();
    
    // Create the Terraform file from template
    const deploymentTemplate = fs.readFileSync('./templates/deployment-template.tf', 'utf8');
    const serviceTemplate = fs.readFileSync('./templates/service-template.tf', 'utf8');

    const deploymentConfig = deploymentTemplate.replace(new RegExp('\\${INSTANCE_NAME}', 'g'), instanceName);
    const serviceConfig = serviceTemplate.replace(new RegExp('\\${INSTANCE_NAME}', 'g'), instanceName).replace(new RegExp('\\${NODE_PORT}', 'g'), nodePort);

    const instanceTerraformFile = `./iac/notebooks/notebook-fe-${instanceName}.tf`;
    fs.writeFileSync(instanceTerraformFile, deploymentConfig + "\n" + serviceConfig);

    // Apply Terraform to reflect the change
    exec('terraform apply -var "running_in_k8s=true" -auto-approve -target=module.notebooks', { cwd: './iac' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(error);
        }
        res.status(201).send('Instance created successfully');
    });
});

app.delete('/deleteInstance/:name', (req, res) => {
    const instanceName = req.params.name;
    const instanceTerraformFile = path.join('./iac/notebooks', `${instanceName}.tf`);

    // Check if the file exists
    if (!fs.existsSync(instanceTerraformFile)) {
        return res.status(404).send('Instance not found');
    }

    // Delete the Terraform file
    fs.unlinkSync(instanceTerraformFile);

    // Apply Terraform to reflect the change
    exec('terraform apply -var "running_in_k8s=true" -auto-approve -target=module.notebooks', { cwd: './iac' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(error);
        }
        res.status(200).send('Instance deleted successfully');
    });
});

app.get('/listInstances', (req, res) => {

    // Get all pods with the label group=notebook-instance
    exec('kubectl get pods -l group=notebook-instance -o=json', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(error);
        }

        const pods = JSON.parse(stdout).items;

        let pending = pods.length; 
        const instances = [];

        if (pending === 0) return res.json([]); // If no pods, return empty array

        pods.forEach(pod => {
            const appLabelValue = pod.metadata.labels.app;

            // For each pod, get its service using the app label
            exec(`kubectl get svc -l app=${appLabelValue},group=notebook-service -o=json`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return res.status(500).send(error);
                }

                const services = JSON.parse(stdout).items;

                if (services && services.length > 0) {
                    const service = services[0]; // Assuming each instance has only one service
                    const nodePort = service.spec.ports[0].nodePort;

                    instances.push({
                        name: pod.metadata.name,
                        ip: pod.status.podIP,
                        port: nodePort
                    });
                }

                if (--pending === 0) {
                    res.json(instances); // Send response once all operations are complete
                }
            });
        });
    });
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});