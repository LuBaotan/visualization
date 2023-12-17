function mydraw() {
    if (ticker) {
        ticker.stop();
    }
    let svg = d3.select('body').select('svg');
    svg.selectAll('*').remove();
    const top_n = 10;
    const margin = {
        top: 80,
        right: 100,
        bottom: 30,
        left: 50
    };
    let height = svg.attr('height')//获取宽高
    let width = svg.attr('width')
    let xAxis;
    let xScale;
    let yScale;
    let yearText;
    let xbegin;
    let ybegin;
    let gHeight;
    let gWidth;

    svg.append("image")
        .attr("xlink:href", "./photo/bz.jpg")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 1100)
        .attr("height", 600)
        .style("opacity", 0.5); // 设置透明度为50%

    const barPadding = (+svg.attr('height') - margin.top - margin.bottom) / (top_n * 5)

    let title = svg.append('text')//标题
        .attr('class', 'Title')
        .attr('y', 30)
        .attr('x', width / 2 - 230)
        .text('BWF World Rankings 2000-2023')
        .style('font-size', '30px'); // 设置字体大小为20像素

    let subTitle = svg.append('text')//子标题
        .attr('y', 55)
        .attr('x', width - margin.right - 10)
        .attr('class', 'subTitle')
        .text("Points")

    const tickDuration = 1000;//执行间隔
    let index;

    const render_init = function (yearSlice) {
        xScale = d3.scaleLinear()//添加x轴比例尺
            .domain([0, d3.max(yearSlice, d => d.points)])
            .range([margin.left, width - margin.right])
            .nice()

        yScale = d3.scaleLinear()//添加y轴比例尺
            .domain([top_n, 0])
            .range([height - margin.bottom, margin.top]);

        xAxis = d3.axisTop(xScale)//设置顶部x坐标轴样式
            .ticks(width > 500 ? 6 : 2)
            .tickSize(-(height - margin.top - margin.bottom))
            .tickFormat(d => d3.format(',')(d))

        svg.append('g')//添加x轴
            .attr('class', 'xAxis')
            .call(xAxis)
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .selectAll('line')
            .style("stroke", 'gray');

        //绘制矩形rect
        svg.selectAll('rect.bar')
            .data(yearSlice, d => d.name)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', xScale(0) + margin.left + 2)
            .attr('width', d => xScale(d.points) - xScale(0))
            .attr('y', d => yScale(d.rank))
            .attr('height', yScale(1) - yScale(0) - barPadding)
            .attr('fill', d => d.color)

        //添加每个矩形对应的品牌名text
        svg.selectAll('text.label')
            .data(yearSlice, d => d.name)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.points) + margin.left / 2)
            .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2))
            .attr('text-anchor', 'end')//右对齐
            .text(d => d.name)

        //添加国旗
        svg.selectAll('svg.flag')
            .data(yearSlice, d => d.name)
            .enter()
            .append("svg")
            .attr('class', 'flag')
            .attr('x', d => margin.left - 40)
            .attr('y', d => yScale(d.rank))
            .attr('width', d => 100)
            .attr('height', yScale(1) - yScale(0) - barPadding)
            .each(function (d) {
                var svgElement = d3.select(this);
                d3.svg("./flag/" + d.country + ".svg").then(function (data) {
                    // 将 SVG 文件内容添加到页面中
                    svgElement.node().append(data.documentElement);
                });
            });

        //添加对应的数值
        svg.selectAll('text.valueLabel')
            .data(yearSlice, d => d.name)
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => xScale(d.points) + margin.left - 20)
            .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2))
            .text(d => d3.format(',.0f')(d.points));

        //年份
        yearText = svg.append('text')
            .attr('class', 'yearText')
            .attr('x', width - margin.right + 70)
            .attr('y', height - 5)
            .attr('font-size', '2em')//字体大小
            .style('font-weight', 'bold')//字体加粗
            .style('fill', '#2eb0c5d9')//填充颜色
            .style('text-anchor', 'end')//右对齐
            .html(datas[index])//文本内容为year
    }

    //获取要显示的年份和数据
    var datas = []
    d3.text('./data/month_dates.txt').then(function (data) {
        // 将字符串按行分割为数组
        var lines = data.trim().split('\n');
        // 将日期字符串存储在数组中
        datas = lines.map(function (line) {
            return line.trim();
        });
        index = datas.length - 1;//起始年份

        d3.csv("./data/SportsRank_data2.csv").then(data => {

            //数据预处理sports_data
            data.forEach(d => {
                d.rank = +d.rank
                d.points = +d.points
                d.lastpoints = +d.lastpoints
                d.data = d.data
                d.country = d.country
                d.name = d.name
                d.color = d3.hsl(Math.random() * 360, 0.75, 0.75, 0.8)
            })
            //console.log(data);

            let yearSlice = data.filter(d => d.data == datas[index])
                .sort((a, b) => b.points - a.points)
                .slice(0, top_n)//变换为数组
            //此时索引就是排名了
            yearSlice.forEach((d, i) => d.rank = i)
            //console.log(yearSlice);

            render_init(yearSlice);

            //滑动进度条
            xbegin = xScale(0) + margin.left;
            ybegin = (height - 15);
            gHeight = 10;
            gWidth = width - margin.right - 230;

            let x = d3.scaleLinear()
                .domain([datas.length - 1, 0])
                .range([0, gWidth])

            let slider = svg.append('g')
                .attr("width", gWidth)
                .attr("height", gHeight)
                .attr("transform", `translate(${xbegin},${ybegin})`);

            // 创建背景条
            slider.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", gWidth)
                .attr("height", gHeight)
                .attr("stroke", "black")
                .raise()
                .attr("rx", 10) // 设置 x 方向的圆角半径
                .attr("ry", 10) // 设置 y 方向的圆角半径
                .attr("fill", "#ddd");

            // 创建进度条
            slider.append("rect")
                .attr('class', 'pro_rect')
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 0)
                .attr("height", gHeight)
                .attr("fill", "rgb(255,0,0)")
                .raise()
                .attr("rx", 10) // 设置 x 方向的圆角半径
                .attr("ry", 10) // 设置 y 方向的圆角半径

            // 创建滑块
            slider.append("circle")
                .attr('class', 'pro_circle')
                .attr("cx", 5)
                .attr("cy", gHeight / 2)
                .attr("r", gHeight / 2)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .raise()
                .call(d3.drag()
                    .on("drag", function (event,d) {
                        let xy = d3.pointer(event, this)
                        console.log(xy)
                        if (xy[0] >= 0 && xy[0] <= gWidth) {
                            d3.select(this)
                                .attr("cx", xy[0])
                            d3.select('.pro_rect')
                                .attr('width', xy[0])
                            index = Math.round(((gWidth - xy[0]) / gWidth) * datas.length);
                        }
                    })
                    .on('end', function (d) {
                        if (!ticker_state && index != 0) {
                            console.log('begin' + index)
                            ticker_state = true;
                            ticker = d3.interval(e, tickDuration);
                        }
                    })
                );

            let e = function callback() {
                //更新数据
                yearSlice = data.filter(d => d.data == datas[index])
                    .sort((a, b) => b.points - a.points).slice(0, top_n);

                yearSlice.forEach((d, i) => d.rank = i)

                //对x轴进行重新映射
                xScale.domain([0, d3.max(yearSlice, d => d.points)])
                //x轴随着图元的值修改
                svg.select('.xAxis')
                    .transition()
                    .duration(tickDuration)//矩形移动的动画效果
                    .ease(d3.easeLinear)//持续时间
                    .call(xAxis)

                //第一步：获取update部分
                let bars = svg.selectAll('.bar')
                    .data(yearSlice, d => d.name);

                //将尚未存在top_n中的数据加入进来
                bars.enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', xScale(0) + margin.left + 2)
                    .attr('width', d => xScale(d.points) - xScale(0))
                    .attr('y', d => yScale(top_n + 1) + 20)//设置初始y坐标
                    .attr('height', yScale(1) - yScale(0) - barPadding)
                    .attr('fill', d => d.color)
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(d.rank))//设置过渡后的y坐标

                //第二次update,之前存在top10的数据要进行修改
                bars.transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('width', d => xScale(d.points) - xScale(0))
                    .attr('y', d => yScale(d.rank))

                //最后一步exit()
                bars.exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(top_n + 1) + 5)
                    .attr('width', d => xScale(d.points) - xScale(0) - 1)
                    .remove()

                //labels与bars相同
                let labels = svg.selectAll('.label')
                    .data(yearSlice, d => d.name)

                labels.enter()
                    .append('text')
                    .attr('class', 'label')
                    .attr('x', d => xScale(d.points) + margin.left / 2)
                    .attr('y', d => yScale(top_n + 1) + 20)
                    .attr('text-anchor', 'end')
                    .text(d => d.name)
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2) + 1)

                labels.transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => xScale(d.points) + margin.left / 2)
                    .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2) + 1)

                labels.exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => xScale(d.points) + margin.left / 2)
                    .attr('y', d => yScale(top_n + 1) + 20)
                    .remove()


                //国旗
                let flags = svg.selectAll('.flag')
                    .data(yearSlice, d => d.name)

                flags.enter()
                    .append("svg")
                    .attr('class', 'flag')
                    .attr('x', d => margin.left - 40)
                    .attr('y', d => yScale(top_n + 1) + 20)
                    .attr('width', d => 100)
                    .attr('height', yScale(1) - yScale(0) - barPadding)
                    .each(function (d) {
                        var svgElement = d3.select(this);
                        d3.svg("./flag/" + d.country + ".svg").then(function (data) {
                            // 将 SVG 文件内容添加到页面中
                            svgElement.node().append(data.documentElement);
                        });
                    })
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(d.rank))

                flags.transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(d.rank))

                flags.exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(top_n + 1) + 20)
                    .remove()

                //valueLabels与bars相同
                let valueLabels = svg.selectAll('.valueLabel')
                    .data(yearSlice, d => d.name)

                valueLabels
                    .enter()
                    .append('text')
                    .attr('class', 'valueLabel')
                    .attr('x', d => xScale(d.points) + margin.left - 20)
                    .attr('y', d => yScale(top_n) + 20)
                    .text(d => d3.format(',')(d.lastpoints))
                    //enter进来的时候用lastvalue，后面update的时候再慢慢增加至value
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2));


                //update加一点数值渐变效果
                valueLabels
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => xScale(d.points) + margin.left - 20)
                    .attr('y', d => yScale(d.rank) + ((yScale(1) - yScale(0)) / 2))
                    .tween("textTween", function (d) {
                        //做出在两个value间跳动的效果
                        let i = d3.interpolateRound(d.lastpoints, d.points);
                        return function (t) {
                            this.textContent = d3.format(',')(i(t));
                        };
                    });

                valueLabels.exit()
                    .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => xScale(d.points) + margin.left - 20)
                    .attr('y', d => yScale(top_n + 1) + 20)
                    .remove()


                yearText.html(datas[index])

                if (index == 0) {
                    ticker_state = false;
                    ticker.stop();
                }
                else {
                    index--;
                }
                newx = ((datas.length - index) / datas.length) * gWidth;
                d3.select('.pro_rect')
                    .attr('width', newx)
                d3.select('.pro_circle')
                    .attr('cx', newx)
            }

            //定时器
            let ticker_state = true;
            ticker = d3.interval(e, tickDuration);
        });//end of d3.csv.then()


    });
}
