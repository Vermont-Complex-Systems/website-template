#!/bin/bash

# Download data files for dashboard-bits-ui
# Run from this directory: ./courses_viz.csv.sh

DOWNLOAD_URL="https://raw.githubusercontent.com/jstonge/uvm-course-viewer/refs/heads/main/transform/output/courses_viz.csv"

curl -o courses_viz.csv "$DOWNLOAD_URL"

echo "Downloaded: courses_viz.csv"