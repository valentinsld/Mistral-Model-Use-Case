# Documentation des Styles SCSS

Ce dossier contient la configuration globale des styles, des variables et des utilitaires pour le projet.

## Architecture

- `main.scss`: Point d'entrée principal des styles.
- `reset.scss`: Réinitialisation CSS de base.
- `variables/`:
  - `variables.scss`: Définition des variables CSS natives (`--color-primary`, etc.).
  - `mixins.scss`: Fonctions et mixins SCSS pour utiliser ces variables.

---

## Fonctions Utilitaires

Ces fonctions facilitent l'accès aux variables CSS définies dans `variables.scss`.

### `color($name, $shade: 500, $opacity: 1)`

Récupère une couleur de la palette avec gestion des nuances et de l'opacité.

- **$name**: Nom de la couleur (ex: 'primary', 'danger').
- **$shade**: Nuance de 0 à 1000 (défaut: 500).
  - `< 500`: Mélange avec blanc (plus clair).
  - `> 500`: Mélange avec noir (plus sombre).
- **$opacity**: Opacité de 0 à 1 (défaut: 1).

```scss
background: color('primary'); // Couleur de base
color: color('danger', 700); // Version plus sombre
border-color: color('success', 500, 0.5); // 50% d'opacité
```

### `font($font-name)`

Récupère la famille de police.

- **$font-name**: 'sans' ou 'serif'.

```scss
font-family: font('sans');
```

### `spacing($multiplier)`

Calcule un espacement basé sur l'unité de base (`--spacing`, par défaut 0.5rem).

- **$multiplier**: Facteur multiplicateur.

```scss
margin: spacing(2); // 1rem
padding: spacing(4); // 2rem
```

### `size($multiplier)`

Calcule une taille basée sur l'unité de taille (`--size`, par défaut 1rem).

- **$multiplier**: Facteur multiplicateur.

```scss
width: size(10);
```

### `weight($weight-name)`

Récupère le poids de la police.

- **$weight-name**: 'thin', 'regular', 'bold', 'black', etc.

```scss
font-weight: weight('bold');
```

### `ease($ease-name)`

Récupère une courbe de bézier pour les transitions.

- **$ease-name**: 'InSine', 'OutExpo', 'InOutBack', etc.

```scss
transition: all 0.3s ease('OutCubic');
```

---

## Mixins

Mixins pour la gestion du responsive, de la typographie et des composants communs.

### Responsive Design

#### `screen-min($breakpoint)`

Media query `min-width` (mobile-first).

- **$breakpoint**: 'sm', 'md', 'lg', 'xl', '2xl'.

```scss
@include screen-min('md') {
  display: flex;
}
```

#### `screen-max($breakpoint)`

Media query `max-width`.

- **$breakpoint**: 'sm', 'md', 'lg', 'xl', '2xl'.

```scss
@include screen-max('sm') {
  display: block;
}
```

### Typographie et Composants

#### `texts($size)`

Applique des pré-reglages de typographie (taille, ligne, famille).

- **$size**: 'sm', 'base', 'lg', 'xl', '2xl' ... '6xl'.
- Note: Les tailles à partir de 'lg' utilisent la police serif.

```scss
h1 {
  @include texts('4xl');
}
```

#### `link-styles()`

Applique les styles par défaut pour les liens (couleur, soulignement, hover).

```scss
a {
  @include link-styles();
}
```

#### `button-styles()`

Applique les styles par défaut pour un bouton (background, padding, arrondi, hover).

```scss
.btn {
  @include button-styles();
}
```
