<script>
import { mouted } from 'cpt/chat/index.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  render: h => {
    return h('div', {}, () => {})
  },
  computed: {
    ...mapGetters(['getRid'])
  },
  methods: {
    ...mapMutations(['setRid'])
  },
  created() {
    let rid = this.$route.params.id
    let oldid = this.getRid
    this.setRid(rid)
    mouted()
    let bridgeBack = () => {
      this.$router.back()
    }
    let bridgePush = path => {
      this.$router.push(path)
    }
    if (rid != oldid) this.$eventBus.$emit('bridge:toggle-room')
    this.$eventBus.$emit('bridge:open-room')
    this.$eventBus.$on('bridge:back', bridgeBack)
    this.$eventBus.$on('bridge:push', bridgePush)
    this.$on('hook:destroyed', () => {
      this.$eventBus.$off('bridge:back', bridgeBack)
      this.$eventBus.$off('bridge:push', bridgePush)
      this.$eventBus.$emit('bridge:close-room')
    })
  }
}
</script>
