import React, { Component } from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { View, Panel, PanelHeader, FormLayout, Button, Input, CardGrid, Card } from '@vkontakte/vkui';//пакеты из вк
// import Icon24CameraOutline from '@vkontakte/icons/dist/24/camera_outline';//это из https://vkcom.github.io/icons/#24/smile
// import Icon24Send from '@vkontakte/icons/dist/24/send';
// import Icon24Smile from '@vkontakte/icons/dist/24/smile';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Icon28StatisticsOutline from '@vkontakte/icons/dist/28/statistics_outline';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			infection: 0,
			recover: 0,
			dead: 0,
			calc: ''
		}
	}

	componentDidMount() {
		//вызываем предыдущее состояние из локалсториджа
		const lastState = localStorage.coronechance
		if (lastState) {
			// console.log(lastState)
			this.setState(JSON.parse(lastState))
		}
	}

	//обязательно используем стрелочные фунции чтоб не прописывать методы в конструкторе
	infectionChange = (event) => {
		this.setState({ infection: Number(event.target.value) });
	}
	recoverChange = (event) => {
		this.setState({ recover: Number(event.target.value) });
	}
	deadChange = (event) => {
		this.setState({ dead: Number(event.target.value) });
	}
	onClickHandler = () => {
		if (this.state.infection && this.state.recover && this.state.dead) {
			let proc = this.state.infection / 100
			let proc_rec = (this.state.recover / proc).toFixed(2)
			let proc_dead = (this.state.dead / proc).toFixed(2)
			this.setState({
				calc: `Выздоровевших ${proc_rec}%, смертей ${proc_dead}%. 
			Это примерно ${Math.ceil(this.state.recover / this.state.dead)} к 1. 
			Зараженно в России ${((this.state.infection / 146745098) * 100).toFixed(4)}% населения.`
			})
			localStorage.coronechance = JSON.stringify(this.state);//сохраняем стейт в локалсторадже
		} else { this.setState({ calc: '' }) }
	}


	render() {
		return (
			<View id="view" activePanel="panel">
				<Panel id="panel">
					<PanelHeader>% заболевших</PanelHeader>
					<div className='container p-2 myDiv'>
						<FormLayout align="center">
							<Input type="number" top="число зараженных" placeholder='всего зараженных' align="center" value={this.state.infection} onChange={this.infectionChange} />
							<Input type="number" top="число выздоровевших" placeholder='всего выздоровевших' align="center" value={this.state.recover} onChange={this.recoverChange} />
							<Input type="number" top="число смертей" placeholder='всего смертей' align="center" value={this.state.dead} onChange={this.deadChange} />
							<Button onClick={this.onClickHandler} before={<Icon28StatisticsOutline />} size="l">вычислить шансы</Button>
							{this.state.calc ?
								<CardGrid>
									<Card size="l" mode="outline">
										{this.state.calc}
									</Card>
								</CardGrid> : null}
						</FormLayout>
					</div>
				</Panel>
			</View>
		);
	}
}

export default App;
