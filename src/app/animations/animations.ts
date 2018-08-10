import { trigger, transition, query, style, animate } from "@angular/animations";

export const appear = trigger('appear', [
    transition('void => *', [
      query(':enter', [
        style({transform: 'translateY(-10%)', opacity: 0}),
        animate('0.3s', style(
          {transform: 'translateY(0)', opacity: 1}
        ))
      ], {optional: true})
    ])
  ])
