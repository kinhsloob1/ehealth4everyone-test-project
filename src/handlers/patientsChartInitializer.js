import * as HighCharts from "highcharts";

const { chart } = HighCharts;
export default (container, chartData) => {
  const categories = [];
  const series = [];

  Object.keys(chartData).forEach(category => {
    const categoryValue = chartData[category];

    if (!series.length) {
      Object.keys(categoryValue).forEach(item => {
        series.push({
          name: item,
          data: []
        });
      });
    }

    const index = categories.push(category);

    Object.keys(categoryValue).forEach(item => {
      const value = categoryValue[item];
      const itemObject = series.find(({ name }) => name === item);

      if (itemObject) {
        const { data } = itemObject;
        data.splice(index, 0, value);
      }
    });
  });

  chart(container, {
    chart: {
      type: "bar"
    },
    title: {
      text: "Patients blood group"
    },
    subtitle: {
      text: "Has both (total data and different age range)"
    },
    xAxis: {
      categories,
      title: {
        text: "Blood Groupss"
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: "Total Patients",
        align: "high"
      },
      labels: {
        overflow: "justify"
      }
    },
    tooltip: {
      valueSuffix: " persons"
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor: HighCharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true
    },
    credits: {
      enabled: false
    },
    series
  });
};
