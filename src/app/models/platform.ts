export class PlatformModel{
    environment: string;
    server: string;
    isValid: boolean;
    licenseServer: IdolComponent;
    instances: Instance[];
}
export class Instance{
    name: string;
    components: IdolComponent[];
    adminComponents: IdolComponent[];
}

export class IdolComponent{
    name: string;
    mainPort: number;
    executablePath: string;
    serviceName: string;
    isActive: boolean;
    isQueryable: boolean;
    isValid: boolean;
}