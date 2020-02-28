<template>
  <div class="recommend">
    <div v-for="(item,index) in recommends" :key="index" class="recommend-item">
      <a :href="item.link">
        <img :src="item.image" alt  />
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecommendView",
  props: {
    recommends: {
      type: Array,
      defatule() {
        return [];
      }
    }
  },
  methods: {
    
  }
};
</script>

<style scoped>
.recommend {
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 10px 0 20;
  border-bottom: 1px solid #eee;
}

.recommend-item {
  flex: 1;
}

.recommend-item img {
  width: 60px;
  height: 60px;
}
</style>



