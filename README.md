
Automated Release Notes GitHub Action
=====================================

Generate clean, formatted release notes automatically for every GitHub release.  
This action parses merged PRs, closed issues, and commit messages to create a changelog section for each new release.

-------------------------------------------------------

🚀 Features (v1.0 Initial Release)
----------------------------------

- Automatically generates release notes from merged pull requests, closed issues, and commits.
- Customizable output format (Markdown).
- Posts release notes to the GitHub Releases page (on push to main/tagged release).
- Supports configurable sections (e.g., Features, Fixes, Breaking Changes).
- Easy to integrate—just drop into your repo’s workflow file.
- Optionally outputs release notes as an artifact or to a file.

-------------------------------------------------------

📦 Getting Started
------------------

Add this action to your workflow:

    name: Automated Release Notes

    on:
      push:
        tags:
          - 'v*'

    jobs:
      release-notes:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - name: Generate release notes
            uses: yourusername/automated-release-notes-action@v1
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}

Inputs
------

| Name           | Required | Description                                |
|----------------|----------|--------------------------------------------|
| github_token   | Yes      | GitHub token to access repo data           |
| output_file    | No       | Path to save release notes (optional)      |
| sections       | No       | Section configuration (optional, JSON/YAML)|

-------------------------------------------------------

📝 Example Release Notes Output
------------------------------

    ## 🚀 Features
    - Add user authentication (#42)
    - Implement dashboard widgets (#55)

    ## 🐛 Fixes
    - Fix login redirect issue (#48)
    - Resolve data sync bug (#61)

-------------------------------------------------------

⚡️ Roadmap / Goals for v1.0
---------------------------

- [x] Parse merged PRs and closed issues since last release/tag
- [x] Format output into Markdown sections
- [x] Post release notes to the GitHub Releases page
- [ ] Support customizable section headers (config file or workflow input)
- [ ] Document all setup/use cases
- [ ] Add tests and CI for action code

-------------------------------------------------------

🤝 Contributing
---------------

Contributions, issues, and feature requests are welcome!  
See CONTRIBUTING.md for more info.

-------------------------------------------------------

📄 License
----------

MIT License

-------------------------------------------------------

💡 Inspiration
--------------

This project was inspired by the need for hassle-free, consistent release notes in fast-moving projects.  
Feel free to suggest improvements!
