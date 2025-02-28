workspace(
    name = "dev-infra",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")

# The PKG rules are needed to build tar packages for integration tests. The builtin
# rule in `@bazel_tools` is not Windows compatible and outdated.
http_archive(
    name = "rules_pkg",
    sha256 = "62eeb544ff1ef41d786e329e1536c1d541bb9bcad27ae984d57f18f314018e66",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.6.0/rules_pkg-0.6.0.tar.gz",
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.6.0/rules_pkg-0.6.0.tar.gz",
    ],
)

# Fetch rules_nodejs so we can install our npm dependencies
http_archive(
    name = "build_bazel_rules_nodejs",
    patches = ["//:yarn-berry.patch"],
    sha256 = "ddb78717b802f8dd5d4c01c340ecdc007c8ced5c1df7db421d0df3d642ea0580",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/4.6.0/rules_nodejs-4.6.0.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "node_repositories", "yarn_install")

node_repositories(
    node_version = "16.10.0",
)

yarn_install(
    name = "npm",
    args = ["--immutable"],
    data = ["//:.yarnrc.yml"],
    # Yarn Berry/v2+ expects `--immutable` instead of `--frozen-lockfile`.
    frozen_lockfile = False,
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//@bazel/protractor:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("//bazel/browsers:browser_repositories.bzl", "browser_repositories")

browser_repositories()

load("@build_bazel_rules_nodejs//toolchains/esbuild:esbuild_repositories.bzl", "esbuild_repositories")

esbuild_repositories()

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

register_toolchains(
    "//tools/git-toolchain:git_linux_toolchain",
    "//tools/git-toolchain:git_macos_x86_toolchain",
    "//tools/git-toolchain:git_macos_arm64_toolchain",
    "//tools/git-toolchain:git_windows_toolchain",
)

http_file(
    name = "bazel_test_status_proto",
    sha256 = "61ce1dc62fdcfd6d68624a403e0f04c5fd5136d933b681467aad1ad2d00dbb03",
    urls = ["https://raw.githubusercontent.com/bazelbuild/bazel/4.2.1/src/main/protobuf/test_status.proto"],
)
