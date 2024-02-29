
// import React from "react";

// class ChangingProgressProvider extends React.Component {
//     static defaultProps = {
//         interval: 1000
//     };

//     state = {
//         valuesIndex: 0
//     };

//     componentDidMount() {
//         setInterval(() => {
//             this.setState({
//                 valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length
//             });
//         }, this.props.interval);
//     }

//     render() {
//         return this.props.children(this.props.values[this.state.valuesIndex]);
//     }
// }

// export default ChangingProgressProvider;
import React from "react";
class ChangingProgressProvider extends React.Component {
    static defaultProps = {
        interval: 1000
    };
    state = {
        valuesIndex: 0
    };
    componentDidMount() {
        this.intervalId = setInterval(() => {
            const nextIndex = this.state.valuesIndex + 1;
            if (nextIndex < this.props.values.length) {
                this.setState({
                    valuesIndex: nextIndex
                });
            } else {
                clearInterval(this.intervalId); // Stop the interval
            }
        }, this.props.interval);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId); // Clear the interval on unmount
    }

    render() {
        return this.props.children(this.props.values[this.state.valuesIndex]);
    }
}
export default ChangingProgressProvider;
