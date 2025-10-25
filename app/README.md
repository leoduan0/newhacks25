# App

## Install

1. Install [Homebrew](https://brew.sh)
1. Install packages via `brew install cocoapods node ruby watchman yarn`
1. Run `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`

## Run

Enable developer mode on your iPhone. See [this](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local).

Go to the `app` directory, then run the following commands:

1. `yarn install`
1. `yarn expo run:ios --device`

Then, download the Expo Go app on your phone, scan the QR code in the terminal (from running the `yarn expo start` command, and voila).
