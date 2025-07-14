export class ResponseLogger {
    logs = [];
    logResponse(response) {
        this.logs.push(response);
        console.log('Response logged:', response);
    }
    getLogs() {
        return this.logs;
    }
}
