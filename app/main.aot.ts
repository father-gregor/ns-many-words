// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from "nativescript-angular/platform-static";
import { registerElement } from "nativescript-angular";
import { LottieView } from "nativescript-lottie";

import { AppModuleNgFactory } from "./app.module.ngfactory";

registerElement("LottieView", () => LottieView);

platformNativeScript().bootstrapModuleFactory(AppModuleNgFactory);
