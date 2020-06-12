function getPlot(id) {
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
        var wfreq = data.metadata.map(d => d.wfreq)
        
        console.log("Washing Freq: ${wfreq}")
        
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
        console.log("OTU IDS: ${OTU_id}")
  
        var labels = samples.otu_labels.slice(0, 10);
  
        console.log("Sample Values: ${samplevalues}")
        console.log("Id Values: ${OTU_top}")

        var bar_trace = {
            type:"bar",
            x: samplevalues,
            y: OTU_id,
            text: labels,
            orientation: "h",
        };
        var bar_data = [bar_trace];
        var bar_layout = {
            title: "Top 10 OTU"
          };
        Plotly.newPlot("bar", bar_data, bar_layout);


        var bubble_trace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
        var bubble_data = [bubble_trace];
        var bubble_layout = {
            title: "OTU ID",
            height: 600,
            width: 1200
        };
        Plotly.newPlot("bubble", bubble_data, bubble_layout); 
  
        var gauge_data = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: "Weekly Washing Frequency"},
          type: "indicator",
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 1], color: "#009a60"},
                    { range: [1, 2], color: "#4aa84e"},
                    { range: [2, 3], color: "#92b73a"},
                    { range: [3, 4], color: "#c6bf22"},
                    { range: [4, 5], color: "#edbd02"},
                    { range: [5, 6], color: "#ffad00"},
                    { range: [6, 7], color: "#ff8c00"},
                    { range: [7, 8], color: "#fc6114"},
                    { range: [8, 9], color: "#f43021"},
                  ]}    
          }
        ];
        var gauge_layout = { 
            width: 600, 
            height: 450, 
            margin: { t: 0, b: 0 } 
        };
        Plotly.newPlot("gauge", gauge_data, gauge_layout);
      });
}  

function getInfo(id) {
    d3.json("data/samples.json").then((data)=> {
        var metadata = data.metadata;

        console.log(metadata)

        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        var demographicInfo = d3.select("#sample-metadata");
        demographicInfo.html("");
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

function init() {
    var dropdown = d3.select("#selDataset");
    d3.json("data/samples.json").then((data)=> {
        console.log(data)
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();