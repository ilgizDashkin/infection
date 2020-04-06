import React, { Component } from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { View, Panel, PanelHeader, FormLayout, Button, Input, CardGrid, Card, Link } from '@vkontakte/vkui';//пакеты из вк
// import Icon24CameraOutline from '@vkontakte/icons/dist/24/camera_outline';//это из https://vkcom.github.io/icons/#24/smile
// import Icon24Send from '@vkontakte/icons/dist/24/send';
// import Icon24Smile from '@vkontakte/icons/dist/24/smile';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Icon28StatisticsOutline from '@vkontakte/icons/dist/28/statistics_outline';
import Icon24Forward10 from '@vkontakte/icons/dist/24/forward_10';
import AnyChart from 'anychart-react'
// import iconv from 'iconv-lite'
// import Parser from 'rss-parser'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			infection: '',
			recover: '',
			dead: '',
			calc: '',
			rss: ''
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
		if (Number(this.state.infection) && Number(this.state.recover) && Number(this.state.dead)) {
			let proc = this.state.infection / 100
			let proc_rec = (this.state.recover / proc).toFixed(2)
			let proc_dead = (this.state.dead / proc).toFixed(2)
			this.setState({
				calc: `Выздоровевших ${proc_rec}%, смертей ${proc_dead}%. 
			Это примерно ${Math.ceil(this.state.recover / this.state.dead)} к 1. 
			Зараженно в России ${((this.state.infection / 146745098) * 100).toFixed(4)}% населения.`
			})
			localStorage.coronechance = JSON.stringify(this.state);//сохраняем стейт в локалсторадже
		} else {
			this.setState({
				infection: '',
				recover: '',
				dead: '',
				calc: ''
			})
		}
	}

	// запрос к серверу за данными
	requestData = async () => {//использовал прокси чтоб обойти cors https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
		//   const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.rospotrebnadzor.ru/region/rss/rss.php?rss=y')
		// const response = await fetch('rss.xml')
		//   const data = await response.text().then(str => new window.DOMParser().parseFromString(str, "text/xml"))
		//   console.log(data)
		try {
			const response = await fetch(`https://ilgiz.h1n.ru/rss.php`)
			const data = await response.json()
			let result = data["rospotreb"].filter(word => word[0][0][0].indexOf('COVID-2019') !== -1);//фильтрую новости по ключевым словам
			console.log(result[0])
			result = result[0][1][0][0]
			this.setState({ rss: result })
		} catch (e) {
			console.error(e)
		}
	}

	render() {
		return (
			<View id="view" activePanel="panel">
				<Panel id="panel">
					<PanelHeader>% заболевших</PanelHeader>
					<div className='container p-2 myDiv'>
						<FormLayout align="center">
							<Input type="number" top="введите число зараженных в России" placeholder='всего зараженных' align="center" value={this.state.infection} onChange={this.infectionChange} />
							<Input type="number" top="введите число выздоровевших" placeholder='всего выздоровевших' align="center" value={this.state.recover} onChange={this.recoverChange} />
							<Input type="number" top="введите число смертей" placeholder='всего смертей' align="center" value={this.state.dead} onChange={this.deadChange} />
							<Button onClick={this.onClickHandler} before={<Icon28StatisticsOutline />} size="l">вычислить шансы</Button>
							{this.state.calc ?
								<CardGrid>
									<Card size="l" mode="outline">
										{this.state.calc}
									</Card>
								</CardGrid> : null}
							{this.state.calc ? <AnyChart
								type="pie"
								//   data={[['выздоровевших',this.state.recover],['смертей',this.state.dead]]}
								data={[
									{
										x: "выздоровевших",
										value: this.state.recover,
										normal: {
											fill: "#58ed0e",
										}
									},
									{
										x: "смертей",
										value: this.state.dead,
										normal: {
											fill: "#ed250e",
										}
									}
								]}
								title="выздоровевших/смертей"
							/> : null}
							<Link href="https://yandex.ru/web-maps/covid19?ll=52.835283%2C-1.561997&z=2" target="_blank">яндекс карта для получения информации по covid19</Link>
							<Button  onClick={this.requestData} before={<Icon24Forward10 />} size="l">
								новости роспотребнадзора COVID-2019
							</Button>
							<div className='text-white'
								dangerouslySetInnerHTML={{ __html: this.state.rss//так можно вставить строку html в react
								 }}>
							</div>
						</FormLayout>
					</div>
				</Panel>
			</View>
		);
	}
}

export default App;

