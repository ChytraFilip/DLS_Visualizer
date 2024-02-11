import Plotly from "plotly.js-dist";

// Function to parse movement commands
function parseMovementCommands(code) {
  // Split the code into steps
  const steps = code.split(/STEP \d+ \/ SP \d+/);
  // Initialize current position and movements list
  let current_position = [0.0, 0.0, 0.0]; // [x, y, z]
  let movements = [[0.0], [0.0], [0.0]]; // [[x1, x2, ...], [y1, y2, ...], [z1, z2, ...]]
  // Parse each step
  for (let step of steps) {
    // Find all movement commands in the step
    const pattern = /(X|Y|Z)\.ABS (\d+\.\d+)/g;
    let match;
    while ((match = pattern.exec(step)) !== null) {
      let axis = match[1];
      let value = parseFloat(match[2]);
      if (axis === "X") {
        current_position[0] = value;
      } else if (axis === "Y") {
        current_position[1] = value;
      } else {
        // axis === 'Z'
        current_position[2] = value * -1;
      }
      // Append current position to movements
      for (let i = 0; i < 3; i++) {
        movements[i].push(current_position[i]);
      }
    }
  }
  return movements; // [[x1, x2, ...], [y1, y2, ...], [z1, z2, ...]]
}

// Function to visualize movement
/**
 * Visualizes the movement based on the provided code.
 * @param {string} code - The movement code to be parsed.
 */
function visualizeMovement(code) {
  const movements = parseMovementCommands(code);
  const x_movements = movements[0];
  const y_movements = movements[1];
  const z_movements = movements[2];

  // Create a separate trace for each step
  let data = [];
  for (let i = 1; i < x_movements.length; i++) {
    // Check if the position has changed
    if (
      x_movements[i] === x_movements[i - 1] &&
      y_movements[i] === y_movements[i - 1] &&
      z_movements[i] === z_movements[i - 1]
    ) {
      continue; // Skip this iteration if the position has not changed
    }

    data.push({
      type: "scatter3d",
      mode: "lines+markers",
      x: x_movements.slice(i - 1, i + 1),
      y: y_movements.slice(i - 1, i + 1),
      z: z_movements.slice(i - 1, i + 1),
      marker: {
        size: 6,
        color:
          "rgb(" +
          Math.round((255 * i) / x_movements.length) +
          ", 0, " +
          Math.round(255 * (1 - i / x_movements.length)) +
          ")",
        opacity: 0.8,
      },
      line: {
        color:
          "rgb(" +
          Math.round((255 * i) / x_movements.length) +
          ", 0, " +
          Math.round(255 * (1 - i / x_movements.length)) +
          ")",
        width: 3,
      },
      name:
        "Step " +
        (i + 1) +
        ": (" +
        x_movements[i] +
        ", " +
        y_movements[i] +
        ", " +
        z_movements[i] +
        ")",
    });
  }

  // Set the title, axis labels, and show the legend
  let layout = {
    title: "Machine Head Movement Visualization",
    scene: {
      xaxis: { title: "X Axis" },
      yaxis: { title: "Y Axis" },
      zaxis: { title: "Z Axis" },
    },
    autosize: false,
    width: 1000,
    height: 800,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 10,
    },
    showlegend: true,
  };

  // Plot the data
  Plotly.newPlot("plotCard", data, layout);
}

export default function visualize() {
  let code = document.getElementById("dlsCode").value;
  const file = document.getElementById("dlsFile").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      code = e.target.result;
      visualizeMovement(code);
    };
    reader.readAsText(file);
  } else {
    visualizeMovement(code);
  }
  // Hide the input card and show the plot card
  document.getElementById("inputCard").classList.add("hidden");
  document.getElementById("plotCard").classList.remove("hidden");
}
