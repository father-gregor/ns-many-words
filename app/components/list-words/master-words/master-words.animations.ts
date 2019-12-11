import { trigger, transition, style, animate, query, animateChild } from "@angular/animations";

const wordsListAnimations = trigger("wordsListAnimations", [
    transition(":enter", [
        query("@buttonAnim", animateChild())
    ])
]);

const chilButtonAnim = trigger("buttonAnim", [
    transition(":enter", [
        style({ opacity: "1" }),
        animate(400, style({ opacity: "0" }))
    ])
]);

export const masterWordsAnimations = [
    wordsListAnimations,
    chilButtonAnim
];
