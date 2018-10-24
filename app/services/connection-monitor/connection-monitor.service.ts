import { Injectable } from '@angular/core';
import * as connectivity from "tns-core-modules/connectivity";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ConnectionMonitorService {
    public changes$: BehaviorSubject<connectivity.connectionType>;
    private _connection: connectivity.connectionType;

    private get currentConnection (): connectivity.connectionType {
        return this._connection;
    }

    private set currentConnection (value) {
        this._connection = value;
        if (this.changes$) {
            this.changes$.next(this._connection);
        }
        else {
            this.changes$ = new BehaviorSubject<connectivity.connectionType>(this._connection);
        }
    }

    constructor () {
        this.currentConnection = connectivity.getConnectionType();

        connectivity.startMonitoring((newConnectionType: number) => {
            switch (newConnectionType) {
                case connectivity.connectionType.none:
                    this.currentConnection = connectivity.connectionType.none;
                    console.log("Connection type changed to none.");
                    break;
                case connectivity.connectionType.wifi:
                    this.currentConnection = connectivity.connectionType.wifi;
                    console.log("Connection type changed to WiFi.");
                    break;
                case connectivity.connectionType.mobile:
                    this.currentConnection = connectivity.connectionType.mobile;
                    console.log("Connection type changed to mobile.");
                    break;
                default:
                    break;
            }
        });
    }

    public getCurrentConnection () {
        return this.currentConnection;
    }
}