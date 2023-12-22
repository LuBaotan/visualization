function mydraw2() {
   // 创建父元素
   if (ticker) {
      ticker.stop();
   }
   var svg = d3.select("body").select('svg')
   svg.selectAll('*').remove();

   const margin = {
      top: 10,
      right: 50,
      bottom: 50,
      left: 50
   };
   let height = svg.attr('height')//获取宽高
   let width = svg.attr('width')
   let select_all = false

   svg.append("image")
      .attr('class', 'image_bc')
      .attr("xlink:href", "./photo/bz.jpg")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 1100)
      .attr("height", 600)
      .style("opacity", 0.5); // 设置透明度为50%

   let data_name = ['林丹', '李宗伟', '安赛龙', '桃田贤斗', '谌龙', '陶菲克', '鲍春来', '盖德', '陈金', '石宇奇', '李梓嘉'];
   let data_src = ['Lin Dan', 'Lee Chong Wei', 'Viktor Axelsen', 'Kento Momota', 'Chen Long', 'Taufik HIDAYAT', 'Bao Chunlai',
      'Peter Gade', 'Chen Jin', 'Shi Yu Qi', 'Lee Zii Jia'];
   let colors = ["#FF0000", "#0000FF", "#00DD00", "#CCCC00", "#FFA500", "#800080", "#FFC0CB", "#00DDDD", "#A52A2A", "#FF7F50", "#8A2BE2"];
   var xScale = d3.scaleBand()//添加x轴比例尺
      .domain(d3.range(data_name.length))
      .range([10, width - margin.right])
      .padding(0.1)

   // 添加按钮
   var name_rect = svg.append("g")
      .selectAll("rect")
      .data(d3.range(0, 11))
      .join("rect")
      .attr("fill", (d) => colors[d])
      .attr("x", (d, i) => xScale(i))
      .attr("width", xScale.bandwidth())
      .attr("y", margin.top)
      .attr("height", 30)
      .attr("rx", 5) // 圆角 x 轴半径
      .attr("ry", 5) // 圆角 y 轴半径
      .on("click", function (d, i) {
         select_rect(d, i);
         person_data(data_src[i], i);
      });

   //添加文本
   svg.append("g")
      .attr("fill", "rgb(255,255,255)")
      .selectAll("text")
      .data(data_name)
      .join("text")
      .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
      .attr("y", margin.top + 30 / 2)
      .style("text-anchor", "middle")  // 居中对齐文本
      .style("alignment-baseline", "middle")  // 垂直居中文本
      .text(d => d)

   svg.append('rect')
      .attr('class', 'rect_all')
      .attr('class', 'rect_all')
      .attr("fill", "rgb(200,0,0)")
      .attr("x", 1050)
      .attr("width", 40)
      .attr("y", margin.top)
      .attr("height", 30)
      .attr("rx", 5) // 圆角 x 轴半径
      .attr("ry", 5) // 圆角 y 轴半径

   svg.append("text")
      .attr("fill", "rgb(255,255,255)")
      .attr("x", 1070)
      .attr("y", margin.top + 30 / 2)
      .style("text-anchor", "middle")  // 居中对齐文本
      .style("alignment-baseline", "middle")  // 垂直居中文本
      .text('ALL')
      .on("click", function (d, i) {
         d3.select('.rect_all')
            .transition()
            .duration(100)
            .attr("fill", "rgb(200,200,200)")
            .transition()
            .duration(100)
            .attr("fill", "rgb(200,0,0)")
         select_all = !select_all;
         if (select_all) {
            clear_below()
            ALL_line_chart();
         }
         else {
            for (let i = 0; i < 11; i++) {
               clear_chart_all(`.name${i}`);
            }
            clear_below()
         }
      });

   function select_rect(d, i) {
      //d3.select('.image1').select('image').remove();
      //d3.select('.image2').select('image').remove();
      for (let i = 0; i < 11; i++) {
         clear_chart_all(`.name${i}`);
      }
      clear_below()
      name_rect.filter((d, j) => i === j)
         .transition()
         .duration(100)
         .attr("fill", "rgb(200,200,200)")
         .transition()
         .duration(100)
         .attr("fill", colors[i])
   }
   set_chart();
   function person_data(src, i) {
      d3.select(".image1")
         .attr("xlink:href", "./photo/" + src + ".png")
         .attr("x", 0)
         .attr("y", margin.top + 35)
         .attr("width", 300)
         .attr("height", 500);

      d3.select(".image2")
         .attr("xlink:href", "./photo_honor/" + src + ".png")
         .attr("x", 0)
         .attr("y", height - 80)
         .attr("width", 300)
         .attr("height", 80);

      d3.csv("./data/" + src + ".csv").then(data => {
         //数据预处理person_data
         data.forEach(d => {
            d.rank = +d.rank
            d.points = +d.points
            d.year = +d.data.substring(0, 4)
            d.week = +d.data.substring(5, 7)
            d.name = d.name
         })
         //console.log(data)
         const minyear = d3.min(data, d => d.year);
         const maxyear = d3.max(data, d => d.year);
         var now_year = minyear;
         let yearSlice = data.filter(d => d.year == now_year)
            .sort((a, b) => b.week - a.week)
            .slice()//变换为数组

         var x_mid = (350 + (width - margin.right)) / 2;
         d3.select('.year_text')
            .attr("x", x_mid)
            .attr("y", margin.top + 55)
            .style('fill', 'red')
            .text(`${now_year}年`)
            .style("text-anchor", "middle")  // 居中对齐文本
            .style("alignment-baseline", "middle")  // 垂直居中文本

         //down
         d3.select('.down_path')
            .append("path")
            .attr("d", `M ${x_mid - 46} ${margin.top + 48} L ${x_mid - 38} ${margin.top + 62} L ${x_mid - 30} ${margin.top + 48} Z`)
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .on("click", function () {
               if (now_year > minyear) {
                  now_year--;
                  clear_chart();
                  yearSlice = data.filter(d => d.year == now_year)
                     .sort((a, b) => b.week - a.week)
                     .slice();//变换为数组                 
                  line_chart(yearSlice, now_year)
               }
            });

         //up
         d3.select('.up_path')
            .append("path")
            .attr("d", `M ${x_mid + 30} ${margin.top + 62} L ${x_mid + 38} ${margin.top + 48} L ${x_mid + 46} ${margin.top + 62} Z`)
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            .on("click", function () {
               if (now_year < maxyear) {
                  now_year++;
                  clear_chart();
                  yearSlice = data.filter(d => d.year == now_year)
                     .sort((a, b) => b.week - a.week)
                     .slice();//变换为数组
                  line_chart(yearSlice, now_year)
               }
            });

         yearSlice.reverse();
         line_chart(yearSlice, now_year)
      })
   }

   function line_chart(yearSlice, now_year) {
      d3.select('.year_text')
         .text(`${now_year}年`);
      //console.log(yearSlice);
      //添加x轴比例尺
      const x_min = d3.min(yearSlice, d => d.week);
      const x_max = d3.max(yearSlice, d => d.week);
      var xScale = d3.scaleLinear()
         .domain([x_min - 0.5, x_max + 0.5])
         .range([350, width - 20])

      const xAxis = d3.axisBottom()
         .scale(xScale)
         .tickValues(d3.range(x_min, x_max + 1));

      var zero = d3.min(yearSlice, d => d.rank) - 2
      const y_min = zero < 0 ? 0 : zero;

      const y_max = d3.max(yearSlice, d => d.rank) + 2;
      //添加y轴比例尺
      var yScale = d3.scaleLinear()
         .domain([y_max, y_min])
         .range([height - margin.bottom, margin.top + 50])

      if (d3.select('.chart1').select('.chart').empty()) {
         d3.select('.chart1')
            .append('g')
            .attr('class', 'chart')
      }
      d3.select('.chart1')
         .select('.chart')
         .attr("transform", `translate(0,${yScale(y_max)})`)
         .call(xAxis);

      if (d3.select('.chart2').select('.chart').empty()) {
         d3.select('.chart2')
            .append('g')
            .attr('class', 'chart')
      }
      d3.select('.chart2')
         .select('.chart')
         .attr("transform", `translate(${350},0)`)
         .call(d3.axisLeft(yScale));

      //添加轴坐标说明
      d3.select('.chart3')
         .append("text")
         .attr("x", 355)
         .attr("y", margin.top + 55)
         .style('fill', 'black')
         .text("y/世界排名")

      d3.select('.chart4')
         .append("text")
         .attr("x", width - margin.right + 15)
         .attr("y", height - 18)
         .style('fill', 'black')
         .text("x/周")

      // 定义线段生成器
      const linechart = d3.line()
         .x(d => xScale(d.week))
         .y(d => yScale(d.rank));

      // 绘制折线图
      d3.select('.chart5')
         .append("path")
         .datum(yearSlice)
         .attr("d", linechart)
         .attr("fill", "none")
         .attr("stroke", "rgb(204, 51, 51)")
         .attr("stroke-width", 2)

      var circles = d3.select('.chart6')
         .selectAll('circle')
         .data(yearSlice)
         .join('circle')
         .attr("cx", d => xScale(d.week))
         .attr("cy", d => yScale(d.rank))
         .attr("r", 3) // 设置半径
         .attr("fill", "white") // 设置颜色
         .attr("stroke", "steelblue")
         .attr("stroke-width", 2)
         .on("click", function (d, i) {
            select_rect(d, i);
            person_data(data_src[i], i);
         });

      // 添加文本提示
      circles.append("title")
         .html(d => {
            return `<tspan x="0" dy="1.2em">周数：${d.week}\n排名：${d.rank}\n积分：${d.points}</tspan>`;
         });

      // 鼠标悬浮事件
      circles.on("mouseover", function (d) {
         d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 5);
      })
         .on("mouseout", function (d) {
            d3.select(this)
               .transition()
               .duration(200)
               .attr("r", 3);
         })
   }

   function ALL_line_chart() {
      d3.text('./data/All_dates.txt').then(function (data) {
         // 将字符串按行分割为数组
         var lines = data.trim().split('\n');
         // 将日期字符串存储在数组中
         var datas = lines.map(function (line) {
            return line.trim();
         });
         //console.log(datas)
         var put_data = [];
         var scales = { xScale: null, yScale: null };
         let len = datas.length;
         zbz(datas, put_data, scales, 0, len, -1, -1)
      })
   }
   function zbz(datas, put_data, scales, left, right, min, max) {
      let x_min = 0;
      let x_max = 61;
      if (right - left < 60) {
         x_max = right - left + 2;
      }
      let jg = Math.round((right - left) / (x_max - 1));
      for (let i = left; i < right - jg; i = i + jg) {
         put_data.push(datas[i])
      }
      put_data.push(datas[right - 1]);
      //console.log(len)
      //console.log(jg)
      //console.log(put_data)

      scales.xScale = d3.scaleLinear()
         .domain([x_min, x_max])
         .range([40, width - 20])

      const xAxis = d3.axisBottom()
         .scale(scales.xScale)
         .tickValues(d3.range(x_min + 1, x_max))
         .tickFormat(function (d) {
            return put_data[d - x_min - 1];
         });

      let y_min, y_max;
      if (max == -1) {
         y_max = 1450;
         y_min = 0;
      }
      else {
         y_max = max;
         y_min = min;
      }
      //console.log('zbc:==', y_min, y_max)
      //添加y轴比例尺
      scales.yScale = d3.scaleLinear()
         .domain([y_max, y_min])
         .range([height - margin.bottom, margin.top + 50])

      if (d3.select('.chart1').select('.chart').empty()) {
         d3.select('.chart1')
            .append('g')
            .attr('class', 'chart')
      }
      d3.select('.chart1')
         .select('.chart')
         .attr("transform", `translate(0,${scales.yScale(y_max)})`)
         .call(xAxis)
         .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", function (d) {
            return "rotate(-65)";
         });

      if (d3.select('.chart2').select('.chart').empty()) {
         d3.select('.chart2')
            .append('g')
            .attr('class', 'chart')
      }
      d3.select('.chart2')
         .select('.chart')
         .attr("transform", `translate(${40},0)`)
         .call(d3.axisLeft(scales.yScale));

      //添加轴坐标说明
      d3.select('.chart3')
         .append("text")
         .attr("x", 45)
         .attr("y", margin.top + 55)
         .style('fill', 'black')
         .text("y/世界排名")

      d3.select('.chart4')
         .append("text")
         .attr("x", width - margin.right + 15)
         .attr("y", height - 18)
         .style('fill', 'black')
         .text("x/周")

      mouse(datas, put_data, scales);

      for (let i = 0; i < 11; i++) {
         clear_chart_all(`.name${i}`);
         put_person_data('./data/' + data_src[i] + '.csv', put_data, scales.xScale, scales.yScale, colors[i], `name${i}`, y_min, y_max);
      }
   }
   function put_person_data(file, put_data, xScale, yScale, color, name, min, max) {
      if (d3.select('.' + name + 'chart5').empty()) {
         set_chart_all(name);
      }
      d3.csv(file).then(data => {
         //数据预处理person_data
         data.forEach(d => {
            d.rank = +d.rank
            d.points = +d.points
            d.year = +d.data.substring(0, 4)
            d.week = +d.data.substring(5, 7)
            d.name = d.name
            d.index = 0
         })
         //console.log(data)
         const minyear = d3.min(data, d => d.year);
         const maxyear = d3.max(data, d => d.year);
         let yearSlice = []
         let j = 0;
         for (let i = data.length - 1; i >= 0; i--) {
            if (put_data.includes(`${data[i].year}/${data[i].week}`) && data[i].rank >= min && data[i].rank <= max) {
               data[i].index = put_data.indexOf(`${data[i].year}/${data[i].week}`) + 1
               yearSlice.push(data[i])
            }
         }
         //console.log(yearSlice)

         // 定义线段生成器
         const linechart = d3.line()
            .x(d => xScale(d.index))
            .y(d => yScale(d.rank));

         // 绘制折线图
         d3.select('.' + name + 'chart5')
            .append("path")
            .datum(yearSlice)
            .attr("d", linechart)
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 2)

         var circles = d3.select('.' + name + 'chart6')
            .selectAll('circle')
            .data(yearSlice)
            .join('circle')
            .attr("cx", d => xScale(d.index))
            .attr("cy", d => yScale(d.rank))
            .attr("r", 3) // 设置半径
            .attr("fill", "white") // 设置颜色
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .on("click", function (d, i) {
               select_rect(d, i);
               person_data(data_src[i], i);
            });

         // 添加文本提示
         circles.append("title")
            .html(d => {
               return `<tspan x="0" dy="1.2em">球员：${d.name}\n周数：${d.year}/${d.week}\n排名：${d.rank}\n积分：${d.points}</tspan>`;
            });
         // 鼠标悬浮事件
         circles.on("mouseover", function (d) {
            d3.select(this)
               .transition()
               .duration(200)
               .attr("r", 5);
         })
            .on("mouseout", function (d) {
               d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("r", 3);
            })
      })
   }
   function mouse(datas, put_data, scales) {
      var x0, y0;
      let mouse_down = false;
      svg.append('g')
         .attr('class', 'mouse')
         .append('rect')

      svg.on("mousemove", function (event) {
         if (mouse_down) {
            const xy = d3.pointer(event, this)
            let x1 = xy[0];
            let y1 = xy[1];
            d3.select('.mouse')
               .select('rect')
               .attr('x', x0)
               .attr('y', y0)
               .attr('width', x1 - x0)
               .attr('height', y1 - y0)
               .attr("fill", "none")
               .attr("stroke", 'black')
         }
      });

      // 添加鼠标按下事件监听器
      svg.on("mousedown", function (event) {
         mouse_down = true;
         const xy = d3.pointer(event, this)
         x0 = xy[0];
         y0 = xy[1]
         //console.log('down: ', x0, y0)
      });

      // 添加鼠标放开事件监听器
      svg.on("mouseup", function (event) {
         mouse_down = false;
         const xy = d3.pointer(event, this)
         x1 = xy[0];
         y1 = xy[1]
         d3.select('.mouse')
            .select('rect')
            .attr("stroke", 'none')
         if (x1 - x0 > 10) {
            let left1 = Math.round(scales.xScale.invert(x0))
            let right1 = Math.round(scales.xScale.invert(x1))
            let ymin = Math.round(scales.yScale.invert(y0))
            let ymax = Math.round(scales.yScale.invert(y1))
            if (ymin < 0) {
               ymin = 0;
            }
            //console.log(ymin, ymax)
            //console.log('up: ', x1, y1)
            let left2 = datas.indexOf(put_data[left1])
            let right2 = datas.indexOf(put_data[right1])
            //console.log(put_data)
            put_data = []
            zbz(datas, put_data, scales, left2, right2, ymin, ymax)
            //console.log(put_data)
         }
      });
   }
   function set_chart_all(name) {
      svg.append("g")
         .attr('class', name + 'chart5');
      svg.append("g")
         .attr('class', name + 'chart6');
   }
   function clear_chart_all(name) {
      d3.select(name + 'chart5').select('path').remove();
      d3.select(name + 'chart6').selectAll('circle').remove();
      d3.select(name + 'chart6').select('title').remove();
   }
   function set_chart() {
      svg.append("text")
         .attr('class', 'year_text');
      svg.append("image")
         .attr('class', 'image1');
      svg.append("image")
         .attr('class', 'image2');
      svg.append("g")
         .attr('class', 'chart1');
      svg.append("g")
         .attr('class', 'chart2');
      svg.append("g")
         .attr('class', 'chart3');
      svg.append("g")
         .attr('class', 'chart4');
      svg.append("g")
         .attr('class', 'chart5');
      svg.append("g")
         .attr('class', 'chart6');
      svg.append("g")
         .attr('class', 'up_path');
      svg.append("g")
         .attr('class', 'down_path');
   }

   function clear_chart() {
      d3.select('.chart1').selectAll('childElementSelector').remove();
      d3.select('.chart2').selectAll('childElementSelector').remove();
      d3.select('.chart3').select('text').remove();
      d3.select('.chart4').select('text').remove();
      d3.select('.chart5').select('path').remove();
      d3.select('.chart6').selectAll('circle').remove();
      d3.select('.chart6').select('title').remove();
   }

   function clear_below() {
      d3.select('.year_text').text(null);
      d3.select('.image1').attr("xlink:href", null);
      d3.select('.image2').attr("xlink:href", null);
      d3.select('.up_path').select('path').remove();
      d3.select('.down_path').select('path').remove();
      d3.select('.chart1').select('.chart').remove();
      d3.select('.chart2').select('.chart').remove();
      clear_chart()
   }
}