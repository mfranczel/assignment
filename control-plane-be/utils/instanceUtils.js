const usedPorts = new Set([32011]);

export function generateUniqueNodePort() {
    let port;
    do {
        port = Math.floor(Math.random() * (32767 - 32012 + 1)) + 32012;
    } while (usedPorts.has(port));
    
    usedPorts.add(port);
    return port;
}

export function generateUniqueName() {
    const timestamp = new Date().getTime();
    return `instance-${timestamp}`;
}
