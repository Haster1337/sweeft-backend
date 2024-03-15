import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class isCompanyGuard implements CanActivate {

    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest()
        try {
            const authHeader = req.headers.authorization
            const token = authHeader.split(" ")[1]

            const user = this.jwtService.decode(token)
            if(user.type !== "company") {
                throw new UnauthorizedException()
            }

            return true;
            
        } catch (error) {
            console.log('2')
            throw new UnauthorizedException()            
        }
    }

}