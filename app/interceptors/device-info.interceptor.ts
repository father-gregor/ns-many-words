import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { device } from "tns-core-modules/platform/platform";

@Injectable()
export class DeviceInfoInterceptor implements HttpInterceptor {
    constructor () {}

    public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const duplicate = req.clone({
            params: req.params
                        .set("os", device.os)
                        .set("osVersion", device.osVersion)
                        .set("manufacter", device.manufacturer)
                        .set("model", device.model)
                        .set("uuid", device.uuid)
        });
        return next.handle(duplicate);
    }
}
