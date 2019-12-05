// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { registerElement } from "nativescript-angular";
import { LottieView } from "nativescript-lottie";

import { AppModule } from "./app.module";

registerElement("LottieView", () => LottieView);

// enableProdMode();
platformNativeScriptDynamic().bootstrapModule(AppModule);
