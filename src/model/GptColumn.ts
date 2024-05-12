export interface gptColumn {
    id: number,
    title: string,
    date: string,
    backgroundImgUrl: string,
    topicList: {id: number, title: string}[]
}

export interface gptColumnDetail extends gptColumn {
    content: string,
    summary: string,
    totalLike: number,
    scrapped: boolean,
    liked: boolean
}