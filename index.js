function App(){

    const [displayTime, setDisplayTime] = React.useState(25*60);

    const [breakTime, setBreakTime] = React.useState(5 * 60);

    const [sessionTime, setSessionTime] = React.useState(25 * 60);

    const [timerOn, setTimerOn] =React.useState(false);

    const [onBreak, setOnBreak] = React.useState(false);

    const [breakAudio, setBreakAudio] = React.useState(new Audio("./alarmsound.mp3"))

    const playBreakSound = () => {
        breakAudio.currentTime = 0;
        breakAudio.play();
    }

    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;
        
        return(
        (minutes < 10 ? "0" + minutes: minutes) + 
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
        );
    }

    const changeTime = (amount,type) => {
        if (type == "break") {
            if(breakTime <= 60 && amount < 0){
                alert("You can not set a break length less than 1 minute.")
                return;
            }
            setBreakTime((prev) => prev + amount);
        } else {
            if(sessionTime <= 60 && amount < 0){
                alert("You can not set a session length less than 1 minute.")
                return;
            }
            setSessionTime((prev) => prev + amount);
            if(!timerOn){
                setDisplayTime(sessionTime + amount);
            }
        }
    };

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if(!timerOn){
            let interval = setInterval(()=> {
                date = new Date().getTime();
                if(date > nextDate){
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVariable){
                            playBreakSound();
                            onBreakVariable = true;
                            setOnBreak(true)
                            return breakTime;
                        }else if(prev <=0 && onBreakVariable){
                            playBreakSound();
                            onBreakVariable = false;
                            setOnBreak(false)
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                } 
            }, 30) 
            localStorage.clear();
            localStorage.setItem('interval-id', interval)
        }
        if(timerOn){
            clearInterval(localStorage.getItem('interval-id'));
        }
        setTimerOn(!timerOn)
    };

    const resetTime = () => {
        setDisplayTime(25*60);
        setBreakTime(5 * 60);
        setSessionTime(25*60);
    }

    return (
        <div className="text-center mt-4"> 

            <h1 className="p-3">Pomodoro Clock</h1>
            <h2 className="p-3 pl-5 pr-5">Need a timer to keep you focused on school work, work projects or your hobbies? Set your session length and your desired break time below.
            When it is time for a break an alarm will ring on this page.
            </h2>
            <div className="dual-container">
            <Length 
            title={"Break Length"} 
            changeTime={changeTime} 
            type={"break"} 
            time={breakTime}
            formatTime={formatTime}
            />

            <Length 
            title={"Session Length"} 
            changeTime={changeTime} 
            type={"session"} 
            time={sessionTime}
            formatTime={formatTime}
            />
            </div>

            <h3>{onBreak ? "Break" : "Session"}</h3>
            <h1>{formatTime(displayTime)}</h1>

            <button type="button" className="btn-lg btn-info m-3" onClick={controlTime}>
                {timerOn ? (
                    <i className="fas fa-pause"></i>
                ) : (
                    <i className="fas fa-play"></i>
                )}
            </button>
            <button type="button" className="btn-lg btn-info" onClick={resetTime}>
                <i className="fa fa-refresh"></i>
            </button>

            <footer>
            <h3 class="myStuff p-5"> Want to see more projects by me? Visit me<a href="danadd.github.io/"> here at dd.github.io/</a> for more projects and contact information.</h3>
            </footer>
        </div>

    )
    
}

function Length({title, changeTime, type, time, formatTime}){
    return (
        <div>
            <h3>{title}</h3>
            <div className="time-sets">
                <button type="button" className="btn btn-danger btn-lg"
                onClick={() => changeTime(-60, type)}
                >
                    <i className="fas fa-angle-double-down"></i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button type="button" className="btn btn-success btn-lg"
                onClick={() => changeTime(+60, type)}
                >
                    <i className="fas fa-angle-double-up"></i>
                </button>
            </div>
        </div>

    );
}

ReactDOM.render(<App/>, document.getElementById('root'))