interface Line {
    kind: "line"
    line: string
}
interface Retcode {
    kind: "retcode"
    retcode: number
}
interface Pid {
    kind: "pid"
    pid: number
}
interface Error {
    kind: "error"
    msg: string
}

type Message = Line | Retcode | Pid | Error

type ConfigType = {
    runcommand_url: string
    kill_url: string
}
