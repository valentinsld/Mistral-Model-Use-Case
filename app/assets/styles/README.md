# SCSS Styles Documentation

This folder contains the project's global style configuration, variables, and utilities.

## Structure

- `main.scss`: Main entry point for styles.
- `reset.scss`: Basic CSS reset.
- `variables/`:
  - `variables.scss`: Definitions for native CSS variables (`--color-primary`, etc.).
  - `mixins.scss`: SCSS functions and mixins that leverage those variables.

---

## Utility Functions

These functions simplify access to the CSS variables defined in `variables.scss`.

### `color($name, $shade: 500, $opacity: 1)`

Retrieves a palette color with shade and opacity handling.

- **$name**: Color name (e.g., 'primary', 'danger').
- **$shade**: Shade from 0 to 1000 (default: 500).
  - `< 500`: Mix with white (lighter).
  - `> 500`: Mix with black (darker).
- **$opacity**: Opacity from 0 to 1 (default: 1).

```scss
background: color("primary"); // Base color
color: color("danger", 700); // Darker version
border-color: color("success", 500, 0.5); // 50% opacity
```

### `font($font-name)`

Retrieves the font family.

- **$font-name**: 'sans' or 'serif'.

```scss
font-family: font("sans");
```

### `spacing($multiplier)`

Computes spacing based on the base unit (`--spacing`, default 0.5rem).

- **$multiplier**: Multiplier factor.

```scss
margin: spacing(2); // 1rem
padding: spacing(4); // 2rem
```

### `size($multiplier)`

Computes size based on the size unit (`--size`, default 1rem).

- **$multiplier**: Multiplier factor.

```scss
width: size(10);
```

### `weight($weight-name)`

Retrieves the font weight.

- **$weight-name**: 'thin', 'regular', 'bold', 'black', etc.

```scss
font-weight: weight("bold");
```

### `ease($ease-name)`

Retrieves a bezier easing curve for transitions.

- **$ease-name**: 'InSine', 'OutExpo', 'InOutBack', etc.

```scss
transition: all 0.3s ease("OutCubic");
```

---

## Mixins

Mixins for responsive handling, typography, and common components.

### Responsive Design

#### `screen-min($breakpoint)`

`min-width` media queries (mobile-first).

- **$breakpoint**: 'sm', 'md', 'lg', 'xl', '2xl'.

```scss
@include screen-min("md") {
  display: flex;
}
```

#### `screen-max($breakpoint)`

`max-width` media queries.

- **$breakpoint**: 'sm', 'md', 'lg', 'xl', '2xl'.

```scss
@include screen-max("sm") {
  display: block;
}
```

### Typography and Components

#### `texts($size)`

Applies predefined typography settings (size, line-height, family).

- **$size**: 'sm', 'base', 'lg', 'xl', '2xl' ... '6xl'.
- Note: Sizes from 'lg' upward use the serif font.

```scss
h1 {
  @include texts("4xl");
}
```

#### `link-styles()`

Applies default styles for links (color, underline, hover).

```scss
a {
  @include link-styles();
}
```

#### `button-styles()`

Applies default button styles (background, padding, border-radius, hover).

```scss
.btn {
  @include button-styles();
}
```
