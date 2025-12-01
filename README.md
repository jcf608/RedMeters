# Kyndryl Shared Principles

This repository contains shared architectural principles, standards, and guidelines used across Kyndryl Agentic AI Platform projects.

## Contents

- **PRINCIPLES.md** - Core architectural principles for AI agent development

## Usage

This repository is designed to be included in other projects using Git Subtree.

### Adding to a new project

```bash
git subtree add --prefix=docs/principles https://github.com/jimfreeman/shared-principles.git main --squash
```

### Pulling updates

```bash
git subtree pull --prefix=docs/principles https://github.com/jimfreeman/shared-principles.git main --squash
```

### Pushing changes back

If you modify the principles in your project and want to share them:

```bash
git subtree push --prefix=docs/principles https://github.com/jimfreeman/shared-principles.git main
```

## Projects Using These Principles

- cross-company-scheduler
- red-energy-marcom (future)

## License

Internal use only - Kyndryl

