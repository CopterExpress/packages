# COEX packages

COEX debian repository: http://packages.coex.tech.

Built with [repogen](https://github.com/pgaskin/repogen). Packages are stored in the [packages](packages) directory. The resulting site is served with GitHub pages.

## Packages

The repo basically contains ROS Noetic related packages, built for Debian Buster and Debian Bookworm on `armhf` architecture (Raspberry Pi OS). It's intended to use for building [Clover drone kit RPi image](https://clover.coex.tech/en/image.html), but you can use it to install ROS packages on your normal Raspberry Pi.

## Usage

To use the repository add it to the sources list:

```bash
wget -O - 'http://packages.coex.tech/key.asc' | apt-key add -
echo 'deb http://packages.coex.tech buster main' >> /etc/apt/sources.list
sudo apt update
```

After that, you can install ROS packages with `apt`, like so:

```bash
sudo apt install ros-noetic-usb-cam ros-noetic-cv-camera ros-noetic-web-video-server
```

## Contribution

You can open a pull request adding your Clover-related packages, and, after get merged, they will be available to install with `apt` on Clover drones.
