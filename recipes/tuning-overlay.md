# Tuning the overlay

Two optional props tweak how the shimmer paints.

## `radius`

The border-radius applied to the overlay. Defaults to `4`. Numbers become `px`; strings pass through, so `"50%"` works for circular avatars.

```tsx
<Bonework skeleton palette={tokens} radius="50%">
  <Avatar src="..." />
</Bonework>
```

If a child element has its own non-zero `border-radius`, Bonework will adopt it automatically &mdash; you only need `radius` when the child is unstyled or when you want to override.

## `duration`

How long one shimmer pass takes, in milliseconds. Defaults to `1_400`.

```tsx
<Bonework skeleton palette={tokens} duration={800}>
  <Card />
</Bonework>
```

Shorter is punchier; longer is calmer. Match it to the tempo of the rest of your motion system.

## Palette

The `palette` prop is the only required colour configuration. Wire it straight to your design tokens so the skeleton stays in step with the rest of the surface.

```tsx
<Bonework
  skeleton
  palette={{
    bone: theme.colour.surface.muted,
    highlight: theme.colour.surface.bold,
  }}
>
  ...
</Bonework>
```

The library deliberately ships no built-in palettes &mdash; bring your own.
