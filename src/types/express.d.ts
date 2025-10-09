import { AuthPayload } from "./auth-payload";
declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload;
    }
  }
}
