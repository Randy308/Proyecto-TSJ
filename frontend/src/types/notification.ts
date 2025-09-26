export interface Notification {
    user_id: number;
    mensaje: string;
    estado: string;
    id: number;
    enlace?:string;
    tipo?:string;
    created_at:string;
}