# Wearly

Wearly is a mobile digital closet application that allows users to organize their clothing, add new items from photos, and create outfits using items they already own.

I built this project to get more experience with mobile development in React Native and to explore how computer vision could be used in a practical application.

## Features

* Add clothing using images from the camera or photo library
* Remove image backgrounds using an on-device TensorFlow Lite model
* Organize clothing by category and color
* Automatically create closet filters based on saved clothing
* Browse saved clothing in a visual closet
* Create outfits using items from the user's closet
* Navigate between multiple screens using stack and tab navigation

## Demo

Demo video coming soon.

Screenshots:

`Home Screen` | `Closet` | `Add Item` | `Create Outfit`

## Tech Stack

* JavaScript
* React Native
* Expo
* React Navigation
* React Context API
* TensorFlow Lite
* react-native-fast-tflite
* Expo Image Picker

## Background Removal

One of the main features I wanted to implement was automatic background removal when adding clothing.

When a user selects an image, Wearly uses a TensorFlow Lite segmentation model to process the image locally on the device. The processed image can then be displayed in the closet without the original background.

Running the model locally also means the image does not need to be sent to an external background-removal API.

## Navigation

The app uses both stack and tab navigation.

The bottom tab navigator handles the main sections of the app, including Home, Closet, Create Outfit, Calendar, and Profile.

A root stack navigator handles screens that should temporarily appear on top of those main screens, such as Add Item. After an item is saved, the screen can be removed from the stack and the user returns to their closet.

## Running the Project

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd wearly
```

Install the dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Wearly uses native TensorFlow Lite functionality, so the background removal feature requires an Expo development build rather than Expo Go.

## What I Learned

This project gave me experience with:

* Building and organizing a multi-screen React Native application
* Managing shared state with React Context
* Working with stack and tab navigation
* Integrating native libraries into an Expo project
* Running a TensorFlow Lite model on-device
* Debugging native dependencies and development builds
* Building reusable mobile UI components
* Taking a project from an initial idea to a working mobile application

## Future Improvements

Some features I would like to continue working on include:

* Weather-based outfit recommendations
* More advanced outfit generation
* Outfit scheduling
* Persistent user accounts and storage
* Closet statistics and clothing usage tracking

## Author

Built by Aime as a software engineering portfolio project.
