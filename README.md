A simple static slide scroller, designed to fit in an 8-hour jam. No outside libraries, just an HTML document, a stylesheet, some plain old JavaScript, and a sample slide deck.

## Supports
- Pre-rendered "slides" in common image formats (JPG, PNG, GIF, SVG)
- Navigation via keyboard arrow keys, mouse clicks, and touchscreen swipes
- Side drawer for fast navigation between slides
- Loading in slide data from an external JSON resource 
- Image scaling settings per slide (hidden away in JSON)
- Caption for each slide

## Doesn't Support
- Slides with custom layout, text, formatting, etc (designing and implementing a spec for this would take too much time to MVP)
- Built-in upload/storage for slides (bring your own images and host them somewhere)
- Dedicated presenter view/notes, custom animations, screen narration, and all the other bells and whistles one would find in a full-fledged presentation product these days

## Abandoned Stretch Enhancements
- ~~Import/export settings/slides via JSON (also kept in localStorage)~~
- ~~Reorder slides via drag and drop in sidebar, add/remove slides via sidebar~~
- ~~Add sliding animations, toggle animations on or off~~

## Design Notes and Restrictions
- How do we make this simple to write and deploy? Part of this comes as a natural result of the "no external libraries" requirement.
- Some functionality we come to expect from modern applications (file storage, slide layout/design, etc) wouldn't easily fit into the alloted timeframe.
  - As such, some features were adjusted/added to work around this barebones feature set and make it at least somewhat pleasant to use.
- To develop this, we need little more than a text editor and a browser to test in. (Speaking of testing, testing frameworks will be considered "external libraries" and not used, much to the dismay of some)
- To deploy this, we need little more than a static web server. Apache, nginx, GitHub Pages, whatever is most convenient.
- I reluctantly decided to not use the built-in Promise API, just in case we wanted to support some non-Edge flavor of Microsoft browser. (It was either deal with callback fallout, or write a promise polyfill from scratch.)
- Number of times `localStoage` was typed instead of `localStorage`: countless

## Credit
- Photographs taken by the author
- SVGs taken from the following public domain examples:
  - Slide 12, "Twelve Angry Tests (SVG)": https://publicdomainvectors.org/en/free-clipart/Judge-with-gavel/41498.html
  - Slide 13, "Lucky 13th Test (SVG)": https://publicdomainvectors.org/en/free-clipart/Flying-Witch-during-full-moon/78453.html
  - Slide 14, "One Four Test (SVG)": https://publicdomainvectors.org/en/free-clipart/Japanese-train/45512.html
  - Slide 15, "Final Fifteenth Test (SVG)": https://en.wikipedia.org/wiki/File:SVG_example_markup_grid.svg