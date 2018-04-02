import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: "LoadingScreen",
    styleUrls: ["./modules/loading-screen/loading-screen-common.css", "./modules/loading-screen/loading-screen.css"],
    templateUrl: "./modules/loading-screen/loading-screen.html"
})
export class LoadingScreenComponent implements OnInit {
    public appName: string = "Many Words";
    public loadingText: string = "Loading...";
    public isLoading: boolean = false;

    constructor(public router: Router) {
    }

    ngOnInit(): void {
    }

    public onTap () {
        this.router.navigate(["/home"]);
    }
}
