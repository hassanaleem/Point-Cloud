# Setting up Server

## Steps:
1. Install MongoDB
2. Navigate to `point-cloud-backend`
3. Run `npm i` to install all dependencies
4. Run `node server.js`

# To Run Frontend

## Steps:
1. Navigate to `point-cloud`
2. Run `npm i` to install dependencies
3. Run `npm start`
4. Open your browser and go to [http://localhost:4200](http://localhost:4200)

# Functionality

1. **Create Measurement**:
   - Click on the measurement button.
   - Double-click on the point cloud to add a point.
   - Double-click again to add another point and a measurement will be drawn.

2. **Create Box Annotation**:
   - Click on the annotation button.
   - Double-click on the point cloud to create a cuboid.

3. **Transform Cuboid**:
   - After creating a cuboid, double-click on any created cuboid to unlock transformation modes (resize, rotate, translate).

4. **Delete Measurement or Annotation**:
   - Double-click on the measurement or annotation to select it, then press delete.

5. **Add Label Annotation**:
   - Click on the label annotation button. This will open a text box.
   - Enter the label name and double-click on the point cloud to create the label annotation.

6. **Saving Point Cloud**;
    - Click on the save button to upload all the changes to the server. Upon next visti, you can pick right where you stopped it. 

7. **Navigate to History Page**:
   - Click on the "Go to History" button. All buttons can be found on the left side.

