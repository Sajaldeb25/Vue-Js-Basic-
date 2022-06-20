let app = Vue.createApp({
    data(){            // Default Functions to access any data
      return {
        showsidebar: false,
        inventory: [],   //dictionary for all products   
        cart: {}
      }
    },
    computed: {
      totalQuantity(){
        // return [1,2,3,4,5].reduce((accu, curr) => {
        //   return accu+curr
        // }, 0)
        console.log(Object.values(this.cart))
        return Object.values(this.cart).reduce((accu, curr) => {
          return accu+ curr
        }, 0)
      }
    },
    methods: {
      addTocart(name, index){
        console.log(name, index)
        if (!this.cart[name]) 
          this.cart[name] = 0
        this.cart[name] = this.inventory[index].quantity
        console.log(this.cart)
        this.inventory[index].quantity = 0

        // console.log(Object.keys(this.cart)) // checking Object.keys/entries/values
      }, 
      toggleSidebar(){
        this.showsidebar = !this.showsidebar
      },
      removeitem(name){
        delete this.cart[name]
      }
    },
    async mounted(){
      const res = await fetch('./food.json')
      const data = await res.json()
      this.inventory = data
    }
  })


  // use as a component 
  app.component('sidebar', {
    props: ['toggle', 'cart', 'inventory', 'remove'],
    computed: {
      // totalQuantity(){
      //   return Object.values(this.cart).reduce((accu, curr) => {
      //     return accu+ curr
      //   }, 0)
      // }
    },
    methods:{
      getprice(name){
        const expected_product = this.inventory.find((product)=>{
          return product.name === name
        })
        return expected_product.price.USD
      },
      calculateTotal(){
        const total = Object.entries(this.cart).reduce((accu, curr, index) => {
          return accu+ (curr[1] * this.getprice(curr[0]))
        }, 0)
        return total.toFixed(2)
      }
    },
    template: `
      <aside class="cart-container">
      <div class="cart">
        <h1 class="cart-title spread">
          <span>
            Cart
            <i class="icofont-cart-alt icofont-1x"></i>
          </span>
          <button  v-on:click="toggle" class="cart-close">&times;</button>
        </h1>

        <div class="cart-body">
          <table class="cart-table">
            <thead>
              <tr>
                <th><span class="sr-only">Product Image</span></th>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(quantity,key, i) in cart" :key="i">  <!-- key is "name" -->
                <td><i class="icofont-carrot icofont-3x"></i></td>
                <td>{{key}}</td>
                <td>$ {{getprice(key)}}</td> 
                <td class="center">{{quantity}}</td>
                <td> $ {{ getprice(key)*quantity }}</td>
                <td class="center">
                  <button v-on:click="remove(key)" class="btn btn-light cart-remove">
                    &times;
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
          <div class="spread">
            <span><strong>Total:</strong> {{ calculateTotal() }}</span>
            <button class="btn btn-light">Checkout</button>
          </div>
        </div>
      </div>
    </aside>
    `
  })

  app.mount('#app')