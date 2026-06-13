import { queryCollectionOptions } from "@tanstack/query-db-collection";
import {
  createCollection,
  createOptimisticAction,
  useLiveQuery,
} from "@tanstack/solid-db";
import { QueryClient } from "@tanstack/solid-query";
import { Component, For } from "solid-js";

type Item = {
  _id: string;
  name: string;
};

type IdItem = {
  id: string;
  name: string;
};

export const CollectionIssue: Component = () => {
  const items = useItemsLiveQuery();
  const idItems = useIdItemsLiveQuery();
  return (
    <>
      <h2>Collection with _id</h2>
      <ol>
        <For each={items()}>
          {(item) => <li id={item.$key}>{item.name}</li>}
        </For>
      </ol>

      <h2>Collection with id</h2>
      <ol>
        <For each={idItems()}>
          {(item) => <li id={`id${item.$key}`}>{item.name}</li>}
        </For>
      </ol>

      <button
        onClick={() => {
          void updateName({ _id: "stuart1", name: "Alvin" });
          void updateIdName({ id: "stuart1", name: "Alvin" });
        }}
      >
        rename stuart
      </button>
    </>
  );
};

const queryClient = new QueryClient();

const collection = createCollection(
  queryCollectionOptions({
    queryKey: ["testCollection"],
    queryClient,
    getKey: (it) => it._id,
    queryFn: async () => {
      return [
        { name: "Bob", _id: "bob1" },
        { name: "Kevin", _id: "kevin1" },
        { name: "Stuart", _id: "stuart1" },
      ] as Item[];
    },
  }),
);

const idCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["idCollection"],
    queryClient,
    getKey: (it) => it.id,
    queryFn: async () => {
      return [
        { name: "Bob", id: "bob1" },
        { name: "Kevin", id: "kevin1" },
        { name: "Stuart", id: "stuart1" },
      ] as IdItem[];
    },
  }),
);

function useItemsLiveQuery() {
  return useLiveQuery((q) => {
    return q.from({ item: collection }).orderBy(({ item }) => item.name, "asc");
  });
}

function useIdItemsLiveQuery() {
  return useLiveQuery((q) => {
    return q
      .from({ item: idCollection })
      .orderBy(({ item }) => item.name, "asc");
  });
}

const updateName = createOptimisticAction<Item>({
  onMutate: ({ _id, name }) => {
    collection.update(_id, (tag) => {
      tag.name = name;
    });
  },
  mutationFn: async ({ _id, name }) => {
    collection.utils.writeUpdate({ _id, name });
  },
});

const updateIdName = createOptimisticAction<IdItem>({
  onMutate: ({ id, name }) => {
    idCollection.update(id, (tag) => {
      tag.name = name;
    });
  },
  mutationFn: async ({ id, name }) => {
    idCollection.utils.writeUpdate({ id, name });
  },
});
