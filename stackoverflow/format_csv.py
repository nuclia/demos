with open('./downloads/QueryResults.csv', "r") as reader:
    with open('./downloads/results.csv', "w") as dest_file:
        line = reader.readline()
        title = ''
        question = ''
        answer = ''
        while line != '':
            if ',"__1__",' in line:
                title = line.split(',"__1__",')[0]
                question = line.split(',"__1__",')[1]
                answer = ''
            elif ',"__2__",' in line:
                question += ' '
                question += line.split(',"__2__",')[0]
                answer = line.split(',"__2__",')[1]
            elif ',"__3__"' in line:
                answer += ' '
                answer += line.split(',"__3__"')[0]
                question = question.replace('\n', '')
                answer = answer.replace('\n', '')
                dest_file.write(f'{title},{question},{answer}\n')
                title = ''
                question = ''
                answer = ''
            else:
                if question:
                    question += ' '
                    question += line
                elif answer:
                    answer += ' '
                    answer += line
            line = reader.readline()

