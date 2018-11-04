export type ScrollDirection = "up" | "down";

export interface ITabScrollEvent {
    direction: ScrollDirection;
    steps: number;
}
