# Frontend Mentor - Mortgage Repayment Calculator Solution

This is a solution to the [Mortgage Repayment Calculator challenge](https://www.frontendmentor.io/challenges/mortgage-repayment-calculator-Kq0ie7J07) on [Frontend Mentor](https://www.frontendmentor.io).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Input mortgage information and see monthly repayment and total repayment amounts after submitting the form
- See form validation messages if any field is incomplete
- Complete the form only using their keyboard
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![Project screenshot](./screenshot.png);

### Links

- Solution URL: [Add your solution URL here](https://github.com/Zuzana83/mortgage-repayment-calculator)
- Live Site URL: [Add your live site URL here](https://your-live-site-url.com)

## My process

### Built with

- Semantic HTML5 markup, including `<form>`, `<fieldset>`, and `<legend>` for the mortgage type selection
- Vanilla CSS with custom properties for theming
- CSS `:has()` selector for styling a custom radio wrapper based on its child's checked state
- Flexbox and CSS Grid
- Mobile-first workflow
- Vanilla JavaScript (no frameworks or libraries)
- Native form behaviors (`type="submit"`, `type="reset"`, the `reset` event) instead of custom-built equivalents where possible

### What I learned

One of the earliest bugs I hit was in my number-field validation. I wanted to reject invalid input using `Number(value) === NaN`, which never worked — every check silently failed. The reason is a genuine quirk of JavaScript: `NaN` is the only value that is never equal to itself, so `NaN === NaN` always evaluates to `false`, no matter what. That's exactly why `isNaN()` exists as its own dedicated function instead of a plain comparison:

```js
const convertedEl = Number(elToCheck);
if (isNaN(convertedEl) || convertedEl < 0 || (convertedEl === 0 && !allowZero)) {
  showError(element, "Insert valid number");
  return;
}
```

That last condition — `convertedEl === 0 && !allowZero` — came from a second, more interesting bug. My mortgage repayment formula divides by `(1 + monthlyRate)^n - 1`. At exactly 0% interest, that denominator becomes zero, producing `NaN` in the result. I fixed the formula itself with a dedicated zero-rate branch (at 0% interest, the monthly payment is simply the loan amount split evenly across the term, since there's no compounding to calculate), but I also realized a 0-year term or a €0 loan amount would break the same formula for a different reason — multiplying by zero payments. Rather than special-casing every zero combination inside the calculation function, I moved the actual fix upstream into validation, since a €0 mortgage or a 0-year term isn't realistic input in the first place. I added an `allowZero` parameter to my validation function so only the interest rate field (where 0% is a legitimate promotional rate) can accept zero, while amount and term reject it outright. This taught me that catching bad data at the source is more robust than defending against every downstream symptom of it.

I also hit a CSS bug that taught me something I'd misunderstood about the `hidden` attribute. I assumed setting `hidden` directly on an element in HTML would override any CSS class rule, but it doesn't — `[hidden] { display: none; }` is just a normal, low-priority rule that ships in the browser's own default stylesheet. My own `.results-empty { display: flex; }` class rule was silently overriding it, so both my "empty" and "completed" result panels stayed visible at once. The fix was combining the class and the attribute into one, more specific selector: `.results-empty[hidden] { display: none; }`.

The most subtle bug of the project came from rebuilding number-input behavior manually. Since I used `type="text"` with `inputmode="decimal"` for better screen reader consistency, I lost the native up/down arrow-key stepping that `type="number"` provides for free, so I built my own with a `keydown` listener and a reusable `handleArrowSteps` function. This surfaced two separate lessons. First, `e.preventDefault()` needs to be scoped tightly inside the specific key-check it belongs to — I initially placed it outside my `if` blocks, which silently blocked all keys in that field, including Tab, breaking keyboard navigation entirely. Second, after wiring up live error-clearing on the `input` event, I noticed errors weren't clearing when using my custom arrow-key stepping. It turns out setting `element.value` programmatically in JavaScript does not fire the native `input` event — that event only fires on genuine user interaction like typing or pasting. I had to extract my error-clearing logic into its own function and call it explicitly from both the `input` listener and `handleArrowSteps`, rather than relying on one event to cover both interaction methods.

### Useful resources

- [MDN Web Docs](https://developer.mozilla.org/) - My first stop for understanding concepts like `NaN`, the `:has()` selector, and the `reset` event before applying them.
- After reading MDN, I generally search for real-world implementations of the same concept to see the theory applied in an actual project, which usually helps it click faster than the reference documentation alone.
- An external mortgage calculator, used to verify my translated formula produced correct real-world numbers before trusting it inside the app.

### AI Collaboration

Using AI as a mentor has become my pattern over the last several projects, and this one followed the same process: asking about the theory behind a concept first, building my own draft, testing it myself and reporting back the actual results, then iterating based on what I found — rather than being handed a solution outright. What I value most about this approach isn't just getting the project built, but understanding the *why* behind each decision and each bug, in a way that building projects entirely on my own has never gotten me to as quickly or as thoroughly.

## Acknowledgments

Thanks to this AI mentor/guide approach I am able to solve more complex projects, learn new concepts, explore more advanced javascript which I would not be able to do just on my own, without verifying I understand theory and implement it correctly. 