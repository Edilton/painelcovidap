import React, { Component } from 'react';
import brasilio from '../../services/brasilio'
import estados from '../../services/estados'
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HC_exporting from 'highcharts/modules/exporting'
import HC_exportingData from 'highcharts/modules/export-data'
HC_exporting(Highcharts)
HC_exportingData(Highcharts)



const getConfig = data => ({

    title: {
        text: 'Números de casos COVID-19'
    },

    subtitle: {
        text: 'Fonte : brasil.io'
    },

    yAxis: {
        title: {
            text: 'Casos'
        }
    },

    xAxis: {
        categories: data.datas

    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },



    series: [{
        name: 'Casos',
        data: data.confirmados
    }, 
    {
        name: 'Mortes',
        data: data.mortes
    },
    {
        name: 'Suspeitos',
        data: data.suspeitos
    }
    ],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

class Casos extends Component {
    state = {
        casos : [],
        data: {
            confirmados : [],
            datas : [],
            mortes : [],
            suspeitos : [],
        },
        cidades : [],
        cidadeAtual : 'ESTADO DO AMAPÁ'
      

    };

    componentDidMount(){
        this.getCasos({place_type: 'state'});
        this.getEstados();
    }

    getCasos = async (filtros) => {
       
        const response = await brasilio.get('', {
            params: {
                state: 'AP',
                place_type: filtros.place_type,
                city: filtros.cidade 
              }
        });
        this.setState({casos: response.data.results.reverse()});
        this.atualizaDados();

    }
    getEstados = async () => {
        const response = await estados.get();
        response.data.estados.map(estado => {
            if (estado.sigla == 'AP'){
                this.setState({cidades: estado.cidades });
            }
        })
    }
 
    
     getCidades = (event) => {
        if(event.target.value == 'todos'){
            this.getCasos({place_type: 'state'});
            this.setState({cidadeAtual: 'ESTADO DO AMAPÁ'});

        } else {
        this.setState(prevState =>({
            data: {
                ...prevState.data,
                confirmados : [],
                datas: [],
                mortes: []
            }
            }));
        this.getCasos({cidade: event.target.value, place_type: 'city'});
        this.setState({cidadeAtual: event.target.value});
        }

    }

    atualizaDados = () => {
        return this.state.casos.map(item => {
            this.setState(prevState =>({
                data: {
                    ...prevState.data,
                    confirmados : [... this.state.data.confirmados, ...[item.confirmed]],
                    datas: [... this.state.data.datas, ...[item.date]],
                    mortes: [... this.state.data.mortes, ...[item.deaths]]
                }
                }));
            }
        );
    }

    handleSubmit =  (event) => {
        event.preventDefault();
    }

    render(){
        const { data } = this.state;
        const { estados } = this.state;
        const { cidades } = this.state;
        const chartConfig = getConfig(data);
        return (
            <div>
                 <div class="card-deck mb-12 text-center">
                    <div class="card mb-4 box-shadow">
                        <div class="card-header">
                        <h4 class="my-0 font-weight-normal">FILTROS POR CIDADE {this.state.cidadeAtual}</h4>
                        </div>
                        <div class="card-body">
                            <form>
                            <div class="form-row align-items-center">

                                <div class="col-md-12 mb-4">
                                <select class="custom-select mr-sm-2" value={this.state.cidadeAtual}  onChange={this.getCidades}>
                                    <option selected value='todos'>ESTADO DO AMAPÁ ou Escolha uma cidade</option>
                                    {cidades.map(cidade => (
                                        <option value={cidade}>{cidade}</option>

                                    ))}
                                </select>
                                
                                </div>
                                
                                <div class="col-auto my-1">
                                <button type="submit" class="btn btn-primary">Buscar</button>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="card-deck mb-12 text-center">
                    <div class="card mb-4 box-shadow">
                        <div class="card-header">
                                    <h4 class="my-0 font-weight-normal">CASOS COVID EM {this.state.cidadeAtual}</h4>
                        </div>
                        <div class="card-body">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={chartConfig}
                            />
                        </div>
                    </div>
                </div>
                    


                    
         </div>
        );

    }
}
  
export default Casos;
