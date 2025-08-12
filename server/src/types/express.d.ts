declare global {
    namespace Express {
        interface Request {
            id?: string;
            rawBody?: Buffer;
            // Add other custom properties here as your app grows
            // user?: User;
            // sessionId?: string;
            // clientIP?: string;
        }
        
        interface Response {
            // Add custom response properties if needed
            // locals?: {
            //     user?: User;
            //     requestId?: string;
            // };
        }
    }
}

// This export is necessary to make this file a module
// Without it, TypeScript treats this as a script file
export {};