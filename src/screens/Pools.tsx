import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { api } from "../services/api"

import { PoolCard, PoolCardProps, } from "../components/PoolCard"
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading"
import { Button } from '../components/Button'
import { Header } from '../components/Header'


export function Pools() {
  const [isLoading, setIsLoading] = useState(true)
  const [pools, setPools] = useState<PoolCardProps[]>([])

  const { navigate } = useNavigation()

  const toast = useToast()

  async function fetchPools() {
    try {

      setIsLoading(true)
      const response = await api.get('/pools')
      setPools(response.data.pools);

    } catch (error) {
      toast.show({
        title: 'Não foi possivél carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []))

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus Bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor={"gray.600"} pb={4} mb={4}>
        <Button
          leftIcon={<Icon as={Octicons} name="search" color={'black'} size={'md'} />}
          title="BUSCAR BOLÃO POR CÓDIGO"
          onPress={() => navigate('find')}
        />
      </VStack>
      {isLoading
        ? <Loading />
        : <FlatList
          data={pools}
          keyExtractor={Item => Item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate("datails", { id: item.id })}
            />
          )}
          ListEmptyComponent={() => <EmptyPoolList />}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          px={5}
        />
      }
    </VStack>
  )
}