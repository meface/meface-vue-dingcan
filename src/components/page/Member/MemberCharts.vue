<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 会员</el-breadcrumb-item>
                <el-breadcrumb-item>数据概览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="schart" v-loading.body="loading">
            <div class="content-title">会员概览</div>
            <schart canvasId="member" :width="width" height="400" :data="chartData.member" type="bar" :options="options"></schart>
        </div>

        <div class="schart" v-loading.body="loading">
            <div class="content-title">消费概览</div>
            <schart canvasId="order" :width="width" height="400" :data="chartData.order" type="bar" :options="options"></schart>
        </div>

        <div class="schart" v-loading.body="loading">
            <div class="content-title">充值概览</div>
            <schart canvasId="recharge" :width="width" height="400" :data="chartData.recharge" type="bar" :options="options"></schart>
        </div>
        
    </div>
</template>
<script>
    import Schart from 'vue-schart';
    export default {
        data () {
            const self = this;
            return {
                loading: true,
                delloading: false,
                url: 'admin/member/charts',
                select_cate: 'year',
                width: document.body.clientWidth-350,
                chartData: {
                    order:[],
                    member:[],
                    recharge:[]
                },
                options: {
                    title: '',
                    bgColor: '#F9FAFC',
                    titleColor: '#ffffff',
                    fillColor: '#99A9BF',
                    axisColor: '#99A9BF',
                    contentColor: '#D3DCE6'
                },
                cates: [{
                  value: 'week',
                  label: '近7日'
                }, {
                  value: 'month',
                  label: '近30日'
                }, {
                  value: 'year',
                  label: '近6个月'
                }]
            }
        },
        watch: {
            
        },
        components: {
            Schart
        },
        beforeMount(){
            let self = this;
            self.$http.get(self.url+'/get/'+self.select_cate).then((res) => {
                self.chartData = res.data.data
                self.loading = false
            })
        },
        methods: {
            Change(val){
                console.log(val)
                this.select_cate = val;
                this.loading = true;
                this.getData(val);
            },
            getData(cate){
                let self = this;
                self.$http.get(self.url + '/' + cate).then((res) => {
                    self.chartData = res.data.data
                    self.loading = false
                })
            }
        }
    }
</script>
<style scoped>
    .handle-select{
        width: 120px;
    }
    .schart{
        width: 100%;
        display: inline-block;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    
</style>