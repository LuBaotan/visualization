
import time

import requests
import parsel
import numpy
import csv

# 输入文件路径和输出文件路径
input_file_path = '../func/NBA_team_datas_2022_23rgl.txt'
output_file_path = 'NBA_name_order.txt'

# 打开输入文件和输出文件
# 打开输入文件和输出文件，指定编码为 'utf-8'
with open(input_file_path, 'r', encoding='utf-8') as input_file, open(output_file_path, 'w',
                                                                      encoding='utf-8') as output_file:
    # 遍历输入文件的每一行
    for line_number, line in enumerate(input_file, 1):
        # 去除行尾的换行符，并使用逗号分隔每一项
        parts = line.strip().split(',')

        # 提取第一个逗号前的内容
        first_part = parts[0].strip()

        # 将提取的内容和行号以制表符分隔写入输出文件
        output_line = f"{first_part} #{line_number-1}\n"
        output_file.write(output_line)

print("转换完成。")