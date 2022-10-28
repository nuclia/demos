import html

with open('./downloads/QueryResults.csv', "r") as reader:
    with open('./downloads/results.csv', "w") as dest_file:
        line = reader.readline()
        title = ''
        question = ''
        answer = ''
        while line != '':
            if ',"__1__",' in line:
                title = line.split(',"__1__",')[0][1:-1]
                question = line.split(',"__1__",')[1][1:]
                answers = ''
            elif ',"__2__",' in line:
                question += ' '
                question += line.split(',"__2__",')[0][:-1]
                answers = line.split(',"__2__",')[1][1:]
            elif ',"__3__"' in line:
                answers += ' '
                answers += line.split(',"__3__"')[0][:-1]
                question = question.replace('\n', '')
                answers = answers.replace('\n', '').replace('<Body>', '')
                answers = ",".join([f'"{html.unescape(a)}"' for a in answers.split('</Body>')[:-1]])
                dest_file.write(f'"{title}","{question}",{answers}\n')
                title = ''
                question = ''
                answers = ''
            else:
                if not answers:
                    question += ' '
                    question += line
                else:
                    answers += ' '
                    answers += line
            line = reader.readline()

