#!/bin/bash

# Mantravi Website Build Script
echo "🚀 Building Mantravi Website..."

# Remove existing build directory
rm -rf build

# Create build directory
mkdir -p build

# Copy essential files only
cp -r assets build/
cp -r components build/
cp -r pages build/
cp -r config build/
cp -r videos build/
cp index.html build/
cp package.json build/
cp render.yaml build/

# Remove unnecessary files from build
cd build
rm -rf node_modules
rm -rf .git
rm -rf *.md
rm -rf docs/
rm -rf examples/
rm -rf build.sh

# Create .gitignore for build
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".DS_Store" >> .gitignore

echo "✅ Build completed successfully!"
echo "📁 Build directory: ./build/"
echo "🌐 Ready for deployment!"
