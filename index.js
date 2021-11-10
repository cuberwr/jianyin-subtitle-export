const fs = require('fs')
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})


projectSrc = fs.readFileSync('/Users/wangrun/Movies/JianyingPro/User\ Data/Projects/com.lveditor.draft/root_draft_meta_info.json')
projects = JSON.parse(projectSrc)


for (i = 0; i < projects.all_draft_store.length; i++) {
    console.log(i + 1 + '.' + projects.all_draft_store[i].draft_name)
}

readline.question(`选择项目`, name => {
    tmp = ''

    path = projects.all_draft_store[name - 1].draft_json_file
    project = JSON.parse(fs.readFileSync(path))
    project.tracks.forEach(track => {
        if (track.type == 'text') {
            getTimes = async (tStart, tEnd) => {
                console.log(tStart, tEnd)
                msStart = ('' + ~~tStart).slice(-3, )
                msEnd = ('' + ~~tEnd).slice(-3, )
                if (tStart >= 1000) {
                    if (tStart % 60000 < 10000) sStart = '0' + (~~((tStart % 60000 )/1000)+ '')
                    else sStart = (~~(tStart % 60000/1000) + '')
                } else sStart = '00'

                if (tEnd >= 1000) {
                    if (tEnd % 60000 < 10000) sEnd = '0' + (~~(tEnd % 60000/1000 )+ '')
                    else sEnd = (~~(tEnd % 60000 /1000)+ '')
                } else sEnd = '00'

                if (tStart >= 60000) {
                    if ((tStart % 3600000) / 60000 < 10) mStart = '0' + (~~(tStart % 3600000 / 60000) + '')
                    else mStart = (~~((tStart % 3600000) / 60000 )+ '')
                    console.log(mStart)
                } else mStart = '00'

                if (tEnd >= 60000) {
                    if (tEnd % 3600000 / 60000 < 10) mEnd = '0' + (~~(tEnd % 3600000 / 60000) + '')
                    else mEnd = (~~(tEnd % 3600000 / 60000) + '')
                } else mEnd = '00'


                if (tStart >= 3600000) {
                    if (tStart / 3600000 < 10) hSratr = '0' + (~~(tStart / 3600000 / 60000) + '')
                    else hStart = ((~~(tStart % 3600000) / 60000 )+ '')
                } else hStart = '00'

                if (tEnd >= 3600000) {
                    if (tEnd / 3600000 < 10) hEnd = '0' +(~~(tEnd / 3600000 )+ '')
                    else hEnd = (~~(tEnd / 3600000) + '')
                } else hEnd = '00'
                console.log(hStart + ':' + mStart + ':' + sStart + '.' + msStart + ' --> ' + hEnd + ':' + mEnd + ':' + sEnd + '.' + msEnd + '\n')
                return hStart + ':' + mStart + ':' + sStart + '.' + msStart + ' --> ' + hEnd + ':' + mEnd + ':' + sEnd + '.' + msEnd + '\n'
            }
            cnm = async (tStart, tEnd) => {
                for (i = 0; i < track.segments.length; i++) {
                    tStart = track.segments[i].target_timerange.start / 1000
                    tEnd = track.segments[i].target_timerange.start / 1000 + track.segments[i].target_timerange.duration / 1000
                    tmp += i + 1 + '\n'
                    tmp += await getTimes(tStart, tEnd)
                    id = track.segments[i].material_id
                    for (j = 0; j < project.materials.texts.length; j++) {
                        if (id == project.materials.texts[j].id) {
                            tmp += project.materials.texts[j].content + '\n\n'
                            break
                        }
                    }
                }
                return
            }

            cndy=async()=>{
                await cnm()
                fs.writeFileSync('./' + projects.all_draft_store[name - 1].draft_name + '.srt', tmp)
            }
            cndy()
        }
    })



    readline.close()
})