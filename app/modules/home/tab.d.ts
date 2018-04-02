import { SegmentedBarItem } from "tns-core-modules/ui/segmented-bar/segmented-bar";

export interface IWordTab {
    tabItem: SegmentedBarItem;
    index: number;
    visible: boolean;
}