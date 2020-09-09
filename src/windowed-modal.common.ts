import { ShowModalOptions } from "@nativescript/core/ui";
export interface ExtendedShowModalOptions extends ShowModalOptions {
    dimAmount?: number;
    windowedModal?: boolean;
}
